from flask import Flask
from controllers.ingredient_controller import ingredient_bp
from controllers.image_upload_controller import image_upload_bp  # Import the new blueprint
from flask_cors import CORS

# Add CORS


app = Flask(__name__)
CORS(app)
# Register Blueprints
app.register_blueprint(ingredient_bp, url_prefix="/api")
app.register_blueprint(image_upload_bp, url_prefix="/api")  # Register the image upload blueprint

if __name__ == "__main__":
    app.run(debug=True)
