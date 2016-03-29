import random
import networkx as nx
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

global grid_size, block_size, fleet_size, t

# Global simulation parameters
margin = .3
grid_size = 6
block_size = 10
fleet_size = 50

'''
    Car class definition
'''
class car:
# Object attributes    
    global grid_size, block_size, fleet_size, t
    lane_width = 9e-2 # The width of the lane
    def __init__(self, claw):
    # What-to-do parameters (might be 'user' provided)
        self.start = random.randrange(len(G.nodes()))
        self.goal = random.randrange(len(G.nodes()))
        self.route = nx.shortest_path(G, self.start, self.goal, 'distance')
    # 'Straight' mode variables
        self.off = 1           # Car off wrt to current edge's start-node
        self.dir = 0          # Axis in which car moves (0=horizontal; 1=vertical)
        self.sns = 0         # Whether car moves positively in axis [-1, 1]
    # 'Cross' mode variables
        self.queue = {'front':[],'right':[],'left':[]}  # Device to track other drivers at intersection
        self.crosspath = []                    # Coordinates to traverse an intersection
        self.t_stop = 0                       # Time car's spent at stop
    # General variables
        self.coo = G.coo[self.start]        # Well, the very car coordinates had to be somewhere
        self.clawfulness = claw            # Relative applied prickness of the average driver
        self.mode = 'straight'            # Whether moving in street ('straight') or intersection ('cross')
        self.history = []                # Record of coordinates
        self.history.append(self.coo)   # Get start pos        
        self.arrival = 0
        if len(self.route)==1:        # 'Were start and goal the same' is what this is saying
            self.got_there = 1       # Finish flag, duh!
        else:
            self.got_there = 0
# Move along a straight street
    def step(self):        
        if self.off < block_size - 2: 
        # Is next position is clear ...(this piece might be functionized)
            # Block may not be necessary since this only goes straight !!!
            nu_dir = int(G.coo[self.route[0]][0] == G.coo[self.route[1]][0])            
            nu_sns = -1 + 2*int(G.coo[self.route[0]][nu_dir] < G.coo[self.route[1]][nu_dir])
            front = (G.coo[self.route[0]][0] + 
                            (1-nu_dir)*nu_sns*(float(self.off+1)/block_size) + 
                                    nu_dir*self.lane_width*nu_sns,
                    G.coo[self.route[0]][1] + 
                            nu_dir*nu_sns*(float(self.off+1)/block_size) - 
                                    (1-nu_dir)*self.lane_width*nu_sns)
        # Clear? Go!
            if not any([car.coo == front for car in fleet]):
                self.off += 1        
                self.dir = int(G.coo[self.route[0]][0] == G.coo[self.route[1]][0])
                self.sns = -1 + 2*int(G.coo[self.route[0]][self.dir] < G.coo[self.route[1]][self.dir])
                self.coo = (G.coo[self.route[0]][0] +
                                (1-self.dir)*self.sns*(float(self.off)/block_size) +      # Add in moving direction
                                        self.dir*self.lane_width*self.sns,        # CountersnsAdd lane_size in perp
                            G.coo[self.route[0]][1] + 
                                self.dir*self.sns*(float(self.off)/block_size) -       # Add 1 in moving direction
                                    (1-self.dir)*self.lane_width*self.sns)     # snsAdd lane_size in perp
        else:  # This produces a fake delay to cross (cuz it takes the main fcn a time_step to go to cross mode)
            if len(self.route) == 2:
                self.got_there = 1
                self.coo = (self.coo[0] + 1.4*self.dir*self.lane_width*self.sns,        # CountersnsAdd lane_size in perp
                            self.coo[1] - 1.4*(1-self.dir)*self.lane_width*self.sns)     # snsAdd lane_size in perp
                self.arrival = t
            else:
                self.mode = 'cross'
                print ("    As of now, we prepare to cross...")
        self.history.append(self.coo)                                      # Update record (whether coo changed or not)
# Inspect other drivers in intersections
    def look4guys(self):
        sites = {}
        queue = {}
        sites['front'] = (G.coo[self.route[1]][0] +                           # Pivot at intersection center
                            (1-self.dir)*self.sns*(2.0/block_size) -           # Add 2 in own direction
                                self.dir*self.lane_width*self.sns,          # Check for OPPOSITE lane
                        G.coo[self.route[1]][1] +                          # Pivot at intersection center
                            self.dir*self.sns*(2.0/block_size) +            # Add 2 in own direction
                                (1-self.dir)*self.lane_width*self.sns)   # Check for OPPOSITE lane
        sites['right'] = (G.coo[self.route[1]][0] -                         # Pivot at intersection center
                            self.dir*self.sns*(2.0/block_size) -             # CountersnsAdd 2 perpendicularly
                                (1-self.dir)*self.lane_width*self.sns,    # snsAdd for opposite lane
                        G.coo[self.route[1]][1] +                        # Pivot at intersection center
                            (1-self.dir)*self.sns*(2.0/block_size) +      # snsAdd 2 perpendicularly
                                (self.dir)*self.lane_width*self.sns)   # snsAdd for OPPOSITE lane
        sites['left'] = (G.coo[self.route[1]][0] +                          # Pivot at intersection center
                            self.dir*self.sns*(2.0/block_size) -             # snsAdd 2 perpendicularly
                                (1-self.dir)*self.lane_width*self.sns,    # CountersnsAdd for OPPOSITE lane
                        G.coo[self.route[1]][1] -                        # Pivot at intersection center
                            (1-self.dir)*self.sns*(2.0/block_size) -      # CountersnsAdd 2 perpendicularly
                                (self.dir)*self.lane_width*self.sns)   # CountersnsAdd for OPPOSITE lane
        for corner in sites:
            queue[corner] = [c for c in fleet if c.coo == sites[corner] and
                                                  c.t_stop > self.t_stop]  # Update queue with guy already in site
        return queue        
# Inspect for any cars still in the intersection (...might exclude i4 OR not_in crosspath for efficient/reckless drivers)
    def check_intersection(self):
        i = []  # List for four sites in intersection (see documentation)
        i += [(G.coo[self.route[0]][0] +
                        (1-self.dir)*self.sns*(1-1.0/block_size) +           # Add in moving direction
                                self.dir*self.lane_width*self.sns,      # CountersnsAdd lane_size in perp
                G.coo[self.route[0]][1] + 
                        self.dir*self.sns*(1-1.0/block_size) -              # Add 1 in moving direction
                            (1-self.dir)*self.lane_width*self.sns)]    # snsAdd lane_size in perp
        i += [(G.coo[self.route[1]][0] +
                        (1-self.dir)*self.sns*(1.0/block_size) +         # Add in moving direction
                                self.dir*self.lane_width*self.sns,    # CountersnsAdd lane_size in perp
                G.coo[self.route[1]][1] + 
                        self.dir*self.sns*(1.0/block_size) -             # Add 1 in moving direction
                            (1-self.dir)*self.lane_width*self.sns)]   # snsAdd lane_size in perp
        i += [(G.coo[self.route[1]][0] +
                        (1-self.dir)*self.sns*(1.0/block_size) -        # Add in moving direction
                                self.dir*self.lane_width*self.sns,   # snsAdd lane_size in perp
                G.coo[self.route[1]][1] + 
                        self.dir*self.sns*(1.0/block_size) +             # Add 1 in moving direction
                            (1-self.dir)*self.lane_width*self.sns)]   # CountersnsAdd lane_size in perp
        i += [(G.coo[self.route[0]][0] +
                        (1-self.dir)*self.sns*(1-1.0/block_size) -        # Add in moving direction
                                self.dir*self.lane_width*self.sns,   # snsAdd lane_size in perp
                G.coo[self.route[0]][1] + 
                        self.dir*self.sns*(1-1.0/block_size) +             # Add 1 in moving direction
                            (1-self.dir)*self.lane_width*self.sns)]   # CountersnsAdd lane_size in perp
        return i

    def stop(self):
        i = self.check_intersection()
        check_inter = 4*[False]
        for site in range(4):
            check_inter[site] = [True for c in fleet if c.coo == i[site]]
        if self.t_stop == 0:            
            self.t_stop += 1              # This'd be the second delay; let inertia take over!
            print ("    __A moment of Zen! **")
        elif self.t_stop == 1:
            print ("    __Now, let's see who's around... "+str(self.queue.values()))
            self.queue = self.look4guys()
            nu_dir = int(G.coo[self.route[1]][0] == G.coo[self.route[2]][0])
            nu_sns = -1 + 2*int(G.coo[self.route[1]][nu_dir] < G.coo[self.route[2]][nu_dir])            
        # Keep going
            if self.dir == nu_dir:
                self.crosspath = [i[0], i[1]]
        # Turn right
            elif self.coo[nu_dir] == G.coo[self.route[1]][nu_dir] + nu_sns*self.lane_width:
                self.crosspath = [i[0]]
        # Turn left
            else:
                self.crosspath = [i[0], i[1], i[2]]
            print ("    __Hmm, next I'll need to go through "+str(self.crosspath))
            self.t_stop += 1
        else:
        # Update queue
            new_queue = self.look4guys()
            for corner in new_queue:  
                if self.queue[corner] != new_queue[corner]:  # Is that the same guy who got here before me (or no one)?
                    self.queue[corner] = []                    
        # Attempt to cross
            if self.crosspath:  # I haven't fully crossed yet
                print ("    __Man, I'm not done crossing yet. Lack "+str(self.crosspath))
                if self.queue.values() and check_inter:  # If previous dudes left & _ALL_ i are clear
                    self.coo = self.crosspath[0]
                    del self.crosspath[0]                   
                self.t_stop += 1
            else:
                if len(self.route) > 2: # It's 'step' who says whether route is done
                    del self.route[0]  # this only removes edge already crossed
                    print ("    __I deleted previous edge. To go:" +str(len(self.route)-1))
                else:
                    print ("    __Route: " + str(self.route))
                    self.got_there = 1
                self.mode = 'straight'
                self.t_stop = 0
                self.off = 1
                return
        self.history.append(self.coo)
        
    def be(self):
        if self.got_there == 0:
            if self.mode == 'straight':
                self.step()
            else:
                self.stop()
