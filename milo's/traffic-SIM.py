# importing dependencies
from flask import Flask, request, jsonify, json
app = Flask(__name__)
app.debug = True

# setting clawfull endpoint
@app.route('/clawfull/<clawfull_rate>', methods = ['GET', 'POST'])

# getting url param
def getClawfullParam(clawfull_rate):	
	# clawfull rate for operations
	rate = clawfull_rate
	return calcule_clawfull(rate)	

# milo's logic goes here
def calcule_clawfull(clawfull_rate):

	# example of data structue to send back to express (server)     
        result_array = [[12, 5, 7, 55], [4, 6, 9, 5]]

        # serialize result_array to JSON before sending back
        resp = json.dumps(result_array)
        return resp


if __name__ == '__main__':
	app.run()
