import math
import csv
import pandas as pd
import numpy as np
from node import Node
from graph import Graph
from grid import Grid
from maze import Maze
import random
import time

maze_path = "../Maze/songs.csv"
filename = "songs2"

mz = Maze(maze_path)
mz.graph2csv(filename)  



print("{time: time.ctime(t)}")
# print(time.ctime(t))