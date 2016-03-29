# importing dependencies
from flask import Flask, request, jsonify, json
from Car import car
app = Flask(__name__)
app.debug = True

# setting clawfull endpoint
@app.route('/clawfull/<claw>', methods = ['GET', 'POST'])

# getting url param
def getClawfullParam(claw):	
	# clawfull rate for operations
    rate = claw
    return traffic_model(rate)

def traffic_model(claw):
    '''
    Grid & fleet initialization
    '''       
    G = nx.Graph()
    G.coo = {}
    for node in range(grid_size**2):
        G.add_node(node)
        G.coo[node] = (node/grid_size, node%grid_size)    
    for node in range(grid_size**2):
        if node <= grid_size**2-grid_size-1:
            G.add_edge(node, node + grid_size, distance = block_size)
        if node%(grid_size) != grid_size-1:
            G.add_edge(node, node+1, distance = block_size)
    fleet = [car(random.randrange(40, 80)) for i in range(fleet_size)]    
        
    '''
    Simulation
    '''
    t = 0   # Timer so we can see a simulation even if it won't converge
    while any([c.got_there == 0 for c in fleet]) and t < 1e3:
        for car in fleet:
            car.be()
        t += 1
   
    '''
    OUTPUT FOR ANALYSIS
    '''
    t_clean = []
    t_claw = []
    for car in fleet:
        t_clean.append(car.arrival)
        t_claw.append(car.arrival*(1+.35*random.random()))
    result_array =  [t_clean, t_claw]
    response = json.dump(result_array)

    return response	
	


if __name__ == '__main__':
    app.run()
