class Node:
    def __init__(self, index=0):
        self.index = index
        # store successors' indices in int
        # self.successors = []
        self.successors = {} # int to [direction, dist]

    def getDirection(self, succ):
        return self.successors[succ][0]

    def getDist(self, succ):
        return self.successors[succ][1]

    def getSuccInfo(self, succ):
        return self.successors[succ]

    def getIndex(self):
        return self.index

    def getSuccessors(self):
        return list(self.successors.keys())

    def setSuccessor(self, succ_int, direction, dist):
        # check whether 'successor' is valid by comparing with the class member
        if succ_int not in self.getSuccessors():
            self.successors[succ_int] = [direction, dist]
        return


    def isSuccessor(self, nd):
        # check whether nd is a successor
        return (nd in self.getSuccessors())

    def isEnd(self):
        return len(self.successors) == 1
        # return len(self.Successors) == 1 and self.index != 1
