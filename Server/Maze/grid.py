from graph import Graph
from node import Node
import random
import time
import math

ori2symbol = {1:'^',2:'v',3:'<',4:'>'}
TURN = {'r':{1:4,4:2,2:3,3:1},'l':{1:3,3:2,2:4,4:1},'f':{1:1,3:3,2:2,4:4},'b':{1:2,3:4,2:1,4:3}}
#TURN = {'l':{1:4,3:1,2:3,4:2},'r':{1:3,3:2,2:4,4:1},'f':{1:1,3:3,2:2,4:4},'b':{1:2,3:4,2:1,4:3}}
ORIENTATION = {'up':1,'down':2,'left':3,'right':4}

class Grid:
    def __init__(self,graph=""):
        self.reset()
        if graph!="":
            self.build_vertice(graph)
            self.build_edges()

    def reset(self):
        self.index_list = set()
        self.vertice = dict() # 1: [0,0]
        self.edges = dict() # (1,2): [0,1]
        self.dist = dict() # (1,2): 2
        self.car_pos = None
        self.car_symbol = None
        self.explored = dict()
                
                
    def generateMap(self,width,height):
        self.reset()
        dist=2
        min_cp = math.floor(math.sqrt(width*height))
        max_cp = math.floor(math.sqrt(width*height)+(width+height)/4)
        while(True):
            nd_set = {}
            edge_list = []
            for i in range(width):
                for j in range(height):
                    self.index_list.add(i*height+j+1)
                    self.vertice[i*height+j+1] = [(width-i-1)*dist,(height-j-1)*dist]
                    nd_set[i*height+j+1] = i*height+j+1
                    if i != width-1:
                        edge_list.append([(i*height+j)+1,((i+1)*height+j)+1])
                    if j != height-1:
                        edge_list.append([(i*height+j)+1,(i*height+j+1)+1])        
            choosen_edge = []
            while(len(set(list(nd_set.values())))!=1):
                pair = random.choice(edge_list)
                if nd_set[pair[0]]!=nd_set[pair[1]] or (nd_set[pair[0]]==nd_set[pair[1]] and random.random()<0.05): # 
                    set_1 = nd_set[pair[0]]
                    set_2 = nd_set[pair[1]]
                    for nd, s in nd_set.items():
                        if s == set_2:
                            nd_set[nd] = set_1
                    choosen_edge.append(pair)

            # check 
            flat_list = [item for l in choosen_edge for item in l]
            checkpoints = 0
            for i_int in self.index_list:
                if flat_list.count(i_int)==1:
                    checkpoints+=1
            
            if checkpoints>=min_cp and checkpoints<=max_cp:break
       
        # dist
        for i_int, j_int in choosen_edge:
            self.dist[(i_int,j_int)] = dist
            self.dist[(j_int,i_int)] = dist
        # build edge
        self.build_edges()

 



    def findPos(self, succ, direction, dist):
        succ_pos = self.vertice[succ]
        pos = []
        if direction == 1: # N
            pos = [succ_pos[0],succ_pos[1]+dist]
        if direction == 2: # S
            pos = [succ_pos[0],succ_pos[1]-dist]
        if direction == 3: # W
            pos = [succ_pos[0]+dist,succ_pos[1]]
        if direction == 4: # E
            pos = [succ_pos[0]-dist,succ_pos[1]]
        return pos

    def checkPos(self, i_int, succ_int, direction, dist):
        pos = self.vertice[i_int]
        succ_pos = self.vertice[succ_int]
        if direction == 1: # N
            return ([pos[0],pos[1]] == [succ_pos[0],succ_pos[1]+dist])
        if direction == 2: # S
            return ([pos[0],pos[1]] == [succ_pos[0],succ_pos[1]-dist])
        if direction == 3: # W
            return ([pos[0],pos[1]] == [succ_pos[0]+dist,succ_pos[1]])
        if direction == 4: # E
            return ([pos[0],pos[1]] == [succ_pos[0]-dist,succ_pos[1]])



    def build_vertice(self,graph):
        maze_nodes = [i for i in graph.nd_dict.values()]
        while(self.index_list != set([i for i in graph.nd_dict.keys()])):
            for i in maze_nodes:
                i_int = i.getIndex()

                if len(self.index_list) == 0: # first node
                    self.index_list.add(i_int)
                    self.vertice[i_int] = [0,0]
                    #if i.isEnd(): self.end[i_int] = [0,0]
                for succ in i.getSuccessors():
                    if succ in self.vertice: # succ is record before -> find pos based on succ
                        direction = i.getDirection(succ)
                        dist = i.getDist(succ)
                        if i_int not in self.vertice: # find pos
                            pos = self.findPos(succ,direction,dist)
                            self.index_list.add(i_int)
                            self.vertice[i_int] = pos
                            #if i.isEnd(): self.end[i_int] = pos
                        else:
                            if  not self.checkPos(i_int,succ,direction,dist):
                                print("ERROR:",dist,direction,i_int,self.vertice[i_int],succ,self.vertice[succ])      
                                
                        self.dist[(i_int,succ)] = dist
        self.shift_map()
        
    
    def shift_map(self):
        min_x = self.min_x()
        min_y = self.min_y()
        
        for idx,v in self.vertice.items():
            self.vertice[idx]=[v[0]-min_x,v[1]-min_y]
        # for idx,v in self.end.items():
        #     self.end[idx]=[v[0]-min_x,v[1]-min_y]
    
    def max_pos(self):
        max_pos = [0,0]
        for pos in self.vertice.values():
            if (pos[0] >= max_pos[0]) and (pos[1] >= max_pos[1]):
                max_pos = pos
        return max_pos
    
    def min_x(self):
        max_pos = 0
        for pos in self.vertice.values():
            if (pos[0] < max_pos):
                max_pos = pos[0]
        return max_pos
    
    def min_y(self):
        max_pos = 0
        for pos in self.vertice.values():
            if (pos[1] < max_pos):
                max_pos = pos[1]
        return max_pos

    # dist in grid
    def M_dist_square(self, start_int, end_int):
        x = self.vertice[end_int][0] - self.vertice[start_int][0]
        y = self.vertice[end_int][1] - self.vertice[start_int][1]
        d = abs(x) + abs(y)
        return d**2

    def build_edges(self):
        for nodes,dist in self.dist.items():
            diff_x = self.vertice[nodes[1]][0] - self.vertice[nodes[0]][0]
            diff_y = self.vertice[nodes[1]][1] - self.vertice[nodes[0]][1]
            edge_list = [] 

            for i in range(1,dist):
                edge_list.append([self.vertice[nodes[0]][0]+i*diff_x//dist,self.vertice[nodes[0]][1]+i*diff_y//dist])

            orientation = ''
            if diff_x!=0:
                orientation = 'h'
            else:
                orientation = 'v'

            self.edges[nodes] = [edge_list, orientation]

    # def printMap(self):
    #     x,y = self.max_pos()
    #     v = self.get_all_vertice()
    #     e = self.get_all_edges()
    #     end = self.get_all_end()

    #     for j in reversed(range(y+1)):
    #         for i in reversed(range(x+1)):
    #             if [i,j] == self.car_pos:
    #                 print(ori2symbol[self.car_symbol],end="")
    #             elif [i,j] in end:
    #                 print('?',end="")
    #             elif [i,j] in v:
    #                 print('*',end="")
    #             elif [[i,j], 'h'] in e:
    #                 print('-',end="")
    #             elif [[i,j], 'v'] in e:
    #                 print('|',end="")
    #             else:
    #                 print(' ',end="")

    #         print()

    def set_car(self, i_int, ori):
        self.car_pos = self.vertice[i_int]
        self.car_symbol = ORIENTATION[ori]

    def get_all_end(self,nd_end):
        vlist = []
        for i in nd_end:
            vlist.append(self.vertice[i])
        return vlist

    def get_all_explored(self,explored):
        vlist = []
        for i in explored:
            vlist.append(self.vertice[i])
        return vlist

    def get_all_vertice(self):
        vlist = []
        for i in self.vertice.values():
            vlist.append(i)
        return vlist

    def get_all_edges(self):
        elist = []
        for coord,ori in self.edges.values():
            for pos in coord:
                elist.append([pos,ori])
        return elist

    # def get_all_explored(self):
    #     elist = []
    #     for pos in self.explored.values():
    #             elist.append(pos)
    #     return elist

    def set_car(self, i_int, ori):
        self.car_pos = self.vertice[i_int]
        self.car_symbol = ori

        
