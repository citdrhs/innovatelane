from flask import Flask, redirect, url_for, request, render_template, flash, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash
#flask handles server routing, flask_sqlAlchemy manages the database/db file, and werkzeug.security hashes user passwords



app = Flask(__name__, template_folder='../pages',static_folder='../static')
app.secret_key = 'looooooooooooooooooooooooooooooooooooooooongFerret'




#tutorial stuff (citation: www.youtube.com/watch?v=nGOOSabPkCM&t); this code below creates the database file and its requirements for a successful commit
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)

class User(db.Model):
    #__tablename__ = 'Userinfo'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(25), unique=True, nullable=False)
    password = db.Column(db.String(250), unique=False, nullable=False)

    #---------------------
    #hash_password is unused, will probably delete later
    def hash_password(password):
        password = generate_password_hash(password)
        return password
    
    def compare_passwords(self, password):
        return check_password_hash(self.password, password)
    #Tuturial code cont. --------------

def __repr__(self):
    return f'<User {self.username}>'


with app.app_context():
    db.create_all()

#-----------------------

@app.route('/')
def home():
    return render_template('signup.html')

#
@app.route('/users')
def users():
    #all_users now contains the data for every user in the User class specified above
    all_users = User.query.all()
    #users is a parameter in users.html that's used to read each iteration of a type of data in the database (id, username, password, and grade)
    return render_template('users.html', users=all_users)
#


#when the app is routed to /success, return welcome and then the username entered plus password
#also there needs to be a space between <username> and <password> or else the two will merge into a single variable for some reason?
@app.route('/success/<username> <password>')
def success(username, password):
    #placeholder code, only run this when a username has already been taken vvvvv
    #also the password parameter above can probably be removed, I'm just leaving it there for now so people know how to format password displaying in the future
    return f'There was an error with your request; most likely, the username "{username}" is already taken (placeholder)'
#--------------------------------------------------------------- ^^^^^^^^^^^^^^^^

@app.route('/flasktestpythoncode', methods=['POST', 'GET'])
#
#function was originally called login() (changed to signup()), change back if code breaks
#
def signup():
    if request.method == 'POST':

        #set "user"'s value to the value inputted in the html    1
        user = request.form['username']
        #an attempt
        passw = request.form['password']
        #hashes the inputted password from signup.html
        passw = User.hash_password(passw)
        #also I don't know if there needs to be two seperate values for usernames, passwords, and grade info, but I'm doing it just to be safe
        


        #more stuff from the tutorial but slightly modified this time to exclude return statements:
        #these two lines add a new user into the database; username, password, and grade are all parameters; the session.add code will only add the user's info for the session, it must be committed on line 61 to become permanent data
        unique_user = User(username=user, password=passw)
        db.session.add(unique_user)
        try:
            db.session.commit()
            print("user added successfully")
            

        except Exception as e:
            db.session.rollback()
            print("Commit failed. Error:" + str(e))
            return render_template('signup.html', error="'" + str(user) + "' has already been taken.")
        #---------------------------    


        #route the app to /success, sets the username parameter equal to user's value when running the success function    2
        return render_template('signup.html')
    
    #this else might need to be deleted since it only runs when the form data is being requested via the GET method and forms are supposed to send data using POST
    #however, I have found a few instances where GET is used instead and I don't know what causes that to happen as of right now
    else:
       
        return render_template('signup.html')
    
#homeclone
@app.route('/homeclone')
def homeclone():
    if "user" in session:
        return render_template('homeclone.html', username=session["user"])
    else:
        return render_template('homeclone.html', username="Log In")
    
#overcoming my "triple constraint"
@app.route('/discover')
def discover():
    print("discover clicked")
    if "user" in session:
        return render_template('discover.html', username=session["user"])
    else:
        return render_template('login.html', error="Log in before creating forums")

@app.route('/communications')
def communications():
    if "user" in session:
        return render_template('communications.html', username=session["user"])
    else:
        #this is so users can still access the login page when reading the terms of service, it isn't actually a valid username
        return redirect(url_for('login'))

@app.route('/termservices')
def termservices():
    if "user" in session:
        return render_template('termservices.html', username=session["user"])
    else:
        return render_template('termservices.html', username="Log In")
    
#CODE FOR LOGIN--------------------------------------
@app.route('/login', methods=['POST', 'GET'])
def login():

    if not("user" in session):

        print("not signed in")

    

        if request.method == 'POST':

            username = request.form['username']
            password = request.form['password']
            print("SIGN UP ROUTING SUCCESSFUL")
            print(str(username) + str(password))

            if 'username' in request.form and 'password' in request.form:
                #################################
                    #########################
                
                    user = User.query.filter_by(username=username).first()
                    #I don't know why compare_passwords is grey, but the code works so it's not a big deal
                    if user and user.compare_passwords(password):
                        session["user"] = username
                        return redirect(url_for('discover'))
                    else:
                        
                        return render_template('login.html', error="That password isn't associated with" + " " + str(username))
                    ###########################
                    ###############################

        
        print("ATTEMPTING RETURN")
        return render_template('login.html')
    
    else:
        print("logout")
        session.pop("user", None)
        return render_template('login.html')
#----------------------------------------------------




if __name__ == '__main__':
    #when running the app (a function), set the debug parameter to True
    #debug sends messages in the console/terminal when it detects in error in the Flask code; once code is COMPLETELY done, simply delete the 'debug=True' from app.run()
    app.run(debug=True)