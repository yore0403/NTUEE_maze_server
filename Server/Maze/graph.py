import math
import csv
import pandas as pd
from pandas.io import parsers
import numpy as np
import json 
from node import Node
import os.path


class Graph:
    def __init__(self, filepath=""):
        self.nd_dict = {} # int to node
        self.data = {}
        if filepath!="":
            if "json" in filepath and os.path.isfile(filepath):
                self.data = json.load(open(filepath))  
                self.parseData()
            else:
                self.data = self.parser(filepath) # parse by Raw
            
            self.initialize()
                

    def getData(self):
        return str(self.data)

    
    def parseData(self):
        data = {}
        for nd_int, nd_dt  in self.data.items():
            nd_int = int(nd_int)
            subdata = {}
            for direction, dt in nd_dt.items(): # direction-> [node, dist]
                direction = int(direction)
                subdata[direction] = dt
            data[nd_int] = subdata
        self.data = data

    def parser(self,filepath):
        raw_data = pd.read_csv(filepath).values
        data = dict()
        for dt in raw_data:
            nd_int = int(dt[0])
            data[nd_int] = dict()
            for i in range(1,5):
                if not math.isnan((dt[i])): # exist succ
                    data[nd_int][i] = [int(dt[i]),int(dt[i+4])]  
        return data      
    
    def initialize(self): # set graph and node
        for nd_int, nd_dt  in self.data.items():
            nd = Node(nd_int)
            for direction, dt in nd_dt.items(): # direction-> [node, dist]
                
                nd.setSuccessor(dt[0],direction,dt[1])
            self.nd_dict[nd_int] = nd



    def shortestPath(self, nd_from, nd_to):
        """ 
        return a path (sequence of nodes) from the current node to the nearest unexplored deadend 
        e.g.
            1 -- 2 -- 3     
                 |    |  ->  shortestPath(1,4) returns [1,2,4]
                 4 -- 5
        dynamic programming
        """
        Q = [nd_from]
        mark = [nd_from]
        distance = {nd_from:0}
        transition_list = {nd_from:None}
        
        while nd_to not in Q:
            nd_int = Q.pop(0) 
            if nd_int not in mark:
                mark.append(nd_int)
            for succ_int in self.nd_dict[nd_int].getSuccessors():
                if (succ_int not in Q) and (succ_int not in mark):
                    Q.append(succ_int)
                    distance[succ_int] = distance[nd_int]+1
                    transition_list[succ_int] = nd_int
        
        
        # trace back
        path = [nd_to]
        nd_cur = nd_to
        while nd_cur != nd_from:
            path.append(transition_list[nd_cur])
            nd_cur = transition_list[nd_cur]
        path.reverse()

        return path

    def graph2csvDict(self):
        # data[nd_int][i] = [int(dt[i]),int(dt[i+4])] 
        result = {}
        for nd_int,nd  in self.nd_dict.items():
            result[nd_int] = {}
            for succ_int in nd.getSuccessors():
                dir, dist = nd.getSuccInfo(succ_int)
                
                # print(nd_int,succ_int,dir,dist)
                result[nd_int][dir] = [succ_int, dist]
        return result

    def grid2graph(self, grid):
        
        for i_int in grid.index_list:
            nd = Node(i_int)
            succs_int = set([i[1] for i in grid.edges if i_int==i[0]]) | set([i[0] for i in grid.edges if i_int==i[1]])
            for succ_int in succs_int:
                dist = grid.dist[i_int,succ_int]
                direction = 1
                if grid.vertice[succ_int][0]-grid.vertice[i_int][0] > 0:
                    direction = 4
                if grid.vertice[succ_int][0]-grid.vertice[i_int][0] < 0:
                    direction = 3
                if grid.vertice[succ_int][1]-grid.vertice[i_int][1] > 0:
                    direction = 2
                if grid.vertice[succ_int][1]-grid.vertice[i_int][1] < 0:
                    direction = 1


                nd.setSuccessor(succ_int,direction,dist)
                
                self.nd_dict[i_int] = nd
                self.data = self.graph2csvDict()

    










