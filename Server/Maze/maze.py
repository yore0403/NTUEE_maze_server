import math
import csv
import pandas as pd
import numpy as np
from node import Node
from graph import Graph
from grid import Grid
import random
import time


maze_path = "../csv/medium_maze.csv"


ori2symbol = {1:'ʌ',2:'v',3:'<',4:'>'}
TURN = {'r':{1:4,4:2,2:3,3:1},'l':{1:3,3:2,2:4,4:1},'f':{1:1,3:3,2:2,4:4},'b':{1:2,3:4,2:1,4:3}}
#TURN = {'l':{1:4,3:1,2:3,4:2},'r':{1:3,3:2,2:4,4:1},'f':{1:1,3:3,2:2,4:4},'b':{1:2,3:4,2:1,4:3}}
ORIENTATION = {'up':1,'down':2,'left':3,'right':4}

_sim = True

class Maze:
    '''
    __init__
    __str__
    setReward
    setEnd -> Graph
    setExplored -> Graph
    pathToString
    getReward
    getPathCost
    findNextBestNode -> Graph
    findPath
    move_car
    set_car
    '''
    def __init__(self, filepath=""):
        self.Graph = Graph(filepath)
        self.step = 0
        self.reward = {}
        self.cost = {'f':1,'b':1,'r':1,'l':1,'t':1} # cmd to cost
        self.checkpoints = []
        self.explored = [] # true explored when moving
        self.setEnd()
        self.Grid = Grid(self.Graph)
        self.accumulate_reward = 0

        self.car_pos = None
        self.car_symbol = None
        self.car_idx = None

    def __str__(self): # grid nd_end explored
        x,y = self.Grid.max_pos()
        v = self.Grid.get_all_vertice()
        e = self.Grid.get_all_edges()
        end = self.Grid.get_all_end(self.checkpoints)
        ex = self.Grid.get_all_explored(self.explored)
        result = ""
        for j in reversed(range(y+1)):
            for i in range(x+1):
                if [i,j] == self.Grid.car_pos:
                    result += ori2symbol[self.Grid.car_symbol]
                elif [i,j] in ex:
                    result += '!'
                elif [i,j] in end:
                    result += '?'
                elif [i,j] in v:
                    result += '+'
                elif [[i,j], 'h'] in e:
                    result += '―'
                    # result += '╌'
                elif [[i,j], 'v'] in e:
                    result += '|'
                else:
                    result += ' '

            if j!=0: result += '\n' 
        
        return result

    def reset(self):
        self.reward = {}
        self.explored = []
        self.setEnd()
        self.accumulate_reward = 0
        self.car_pos = None
        self.car_symbol = None
        self.car_idx = None


    def setReward(self,nd_start): # graph and grid
        for i_int in self.Graph.nd_dict.keys(): # node
            if i_int in self.checkpoints:
                self.reward[i_int] = self.Grid.M_dist_square(nd_start,i_int) # c
    
    
    def setEnd(self): # graph isEnd
        self.checkpoints = [nd.getIndex() for nd in self.Graph.nd_dict.values() if nd.isEnd()]


    def setExplored(self,nd_int): # explored
        if nd_int not in self.explored:
            self.explored.append(nd_int)
    
    def pathToString(self, path): # graph nd_dict
        direction = ''
        nd_dict = self.Graph.nd_dict
        for i in range(-1,len(path)-2):
            # trans = (nd_dict[path[i]].getDirection(path[i+1]), nd_dict[path[i+1]].getDirection(path[i+2]))
            if i==-1:
                trans = (self.Grid.car_symbol,nd_dict[path[0]].getDirection(path[1]))
            else:
                trans = (nd_dict[path[i]].getDirection(path[i+1]), nd_dict[path[i+1]].getDirection(path[i+2]))
            #trans = (self.nd_direction[path[i]][path[i+1]], self.nd_direction[path[i+1]][path[i+2]])
            if trans in [(1,4),(3,1),(2,3),(4,2)]:
                cmmd = 'r'
            elif trans in [(1,3),(4,1),(2,4),(3,2)]:
                cmmd = 'l'
            elif trans in [(1,1),(2,2),(3,3),(4,4)]:
                cmmd = 'f'
            elif trans in [(1,2),(2,1),(3,4),(4,3)]:
                cmmd ='b'
            direction += cmmd
        return direction

    def getReward(self, path): # explored nd_end
        # find last node reward
        # only end node had reward
        if path[-1] not in self.explored and path[-1] in self.checkpoints: # check in end
            return self.reward[path[-1]]
        else:
            return 0

    def grid2edge(self):
        self.Graph.grid2graph(self.Grid)

    def getPathCost(self, path): # pathToString cost
        direction_str = self.pathToString(path)
        cost = 1 # prevent zero
        for move in ['f','r','l','b']:
            cost += direction_str.count(move)*self.cost[move] 
        return cost


    def findNextBestNode(self,nd_start,explored): # graph reward cost
        path_dict = {}
        for i_int in self.checkpoints:
            if i_int not in explored:
                path = self.Graph.shortestPath(nd_start, i_int) # find all node'path
                path_dict[i_int] = path

        best_cp = 0.0
        best_nodes = []
        best_paths = []

        for i_int, path in path_dict.items():
            reward = self.getReward(path)
            cost = self.getPathCost(path)

            #print('Direction sequence: %s' % (maze.pathToString(path)))
            #print('Distance: %s' % (maze.M_dist(path)))
            if len(path)-1 > 0:
                #print('Reward: %s, cost: %s, CP value: %s, %s' % (reward,cost,reward/cost,path))
                if best_cp == (reward/cost):
                    best_nodes.append(path[1])
                    best_paths.append(path)	

                if best_cp < (reward/cost):
                    best_cp = reward/cost
                    best_nodes = [path[1]]
                    best_paths = [path]			
        
        if best_paths != []:
            best_path = random.choice(best_paths)
        else:
            best_path = None
        return best_path


    def findPath(self,nd_start):
        '''
        find the best path to traverse all end node
        concept:
            calculate path cost: f -> 2, l,r -> 3
            cp_value = score/cost
        '''
        self.accumulate_reward = 0
        explored = []
        self.setReward(nd_start)
        
        step = 0
        reward = 0
        
        if nd_start not in explored: explored.append(nd_start)
        # start search
        nd_nxt = nd_start
        # self.setExplored(nd_nxt)
        path = [nd_nxt]
        while(True):
            path_nxt = self.findNextBestNode(nd_nxt,explored)
            if not path_nxt:break
            nd_nxt = path_nxt[-1]
            
            path.extend(path_nxt[1:])

            if nd_nxt not in explored: # check
                reward += self.reward[nd_nxt]
                explored.append(nd_nxt)
            
            if set(self.checkpoints) == set(explored):
                break


        pathstr = self.pathToString(path)
        step = len(pathstr)-1
        return pathstr,step,reward
        
    def move_car(self, direction):
        if direction == 'x':
            return self.car_idx, self.Grid.car_symbol

        if direction not in TURN.keys():
            print("Invalid cmd!")
            return
        next_ori = TURN[direction][self.Grid.car_symbol]
        self.Grid.car_symbol = next_ori
        next_idx = self.car_idx
        # TODO
        for idx in self.Graph.nd_dict[self.car_idx].getSuccessors():        
            if self.Graph.nd_dict[self.car_idx].getDirection(int(idx)) == next_ori:
                next_idx = idx
        self.car_idx = next_idx
        if next_idx in self.checkpoints:
            self.explored.append(next_idx)
        self.Grid.set_car(next_idx, next_ori)

        return next_idx, next_ori

    def set_car(self,idx, ori=""):
        self.car_idx = idx
        if idx in self.checkpoints:
            self.explored.append(idx)
        if ori != "":
            self.Grid.set_car(idx, ori)
        else:
            succs = self.Graph.nd_dict[idx].getSuccessors()
            if len(succs) == 1:
                succ = succs[0]
                self.Grid.set_car(idx, self.Graph.nd_dict[idx].getDirection(succ))
            else:
                self.Grid.set_car(idx, 1)

        return self.Grid.car_symbol

    def set_car_by_orientation(self,idx, ori):
        self.Grid.set_car(idx, ori)


    def printInstruction(self):
        print("Mode:")
        print("    0 - ResetMap")
        print("    1 - FindShortestPath")
        print("    2 - KeyboardInput")
        print("    3 - GenerateMap")
        print("    4 - Export CSV")
        print("   -1 - Exit")

    def generateMap(self,width,height):
        self.Grid.generateMap(width,height)
        self.Graph.grid2graph(self.Grid)
        self.setEnd()
        # print(self)


    def graph2csv(self):
        # data[nd_int][i] = [int(dt[i]),int(dt[i+4])] 
        result = []
        for nd_int,nd  in self.Graph.nd_dict.items():
            row = [str(nd_int)]
            direction = ['','','','']
            distance = ['','','','']
            for succ_int in nd.getSuccessors():
                dir, dist = nd.getSuccInfo(succ_int)
                # print(nd_int,succ_int,dir,dist)
                direction[dir-1] = str(succ_int)
                distance[dir-1] = str(dist)
            row.extend(direction)
            row.extend(distance)
            result.append(row)
    

        return result

    def writecsv(self,filename,result):
        with open('../csv/'+filename+'.csv', 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(
                ['index','North','South','West','East','ND','SD','WD','ED']
            )
            for row in result:
                writer.writerow(row)


if __name__=='__main__':
    mz = Maze(maze_path)
    print("Import: "+maze_path)


    
    while(True):
        mz.printInstruction()
        mode = int(input("Enter mode: "))


        if mode == 1: # 
            mz.explored = [] # reset 
            nd_start = int(input("Enter starting node: "))
            verbose = input("Show all states? Y/N : ")
            path, step, reward = mz.findPath(nd_start)

            if verbose == 'Y':
                mz.set_car(nd_start)
                fpath = 'f'+path
                print(mz)
                input("Start. Press enter to continue...") 
                for i in range(len(fpath)):
                    mz.move_car(fpath[i])
                    print(mz)
                    print("step:",i,", action:",fpath[i])  
                    input("Press enter to continue...")              

            print("Path: ", path)
            print("Steps: ", step+1)
            print("Reward: ", reward)
            input("Done. Press enter to continue...")              
            
        elif mode == 2:
            mz.explored = [] # reset 
            nd_start = int(input("Enter starting node: "))
            mz.set_car(nd_start)
            print(mz)      
            while(True):
                nxt = input("Enter command: ")
                if nxt == 'exit':break
                for i in range(len(nxt)):
                    mz.move_car(nxt[i])
                    print(mz)
            input("Exit. Press enter to continue...")              
        elif mode == 3:
            mz.reset()
            width = int(input("Enter width: "))
            height = int(input("Enter height: "))
            mz.generateMap(width,height)
            input("Done. Press enter to continue...")              
        elif mode == 4:
            maze_path = input("Enter import file name: ")
            mz = Maze('../csv/'+maze_path+'.csv')
        elif mode == 5:
            print(mz)      
            r = input("Export? Y/N: ") 
            if r == 'Y': 
                filename = input("Enter file name: ") 
                mz.graph2csv(filename)    
        elif mode == 0:
            print("Reset maze...")
            mz.reset()
        elif mode == -1:
                break

                





