import os
from flask import Flask
from controllers.ingredient_controller import ingredient_bp
from controllers.image_upload_controller import image_upload_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(ingredient_bp, url_prefix="/api")
app.register_blueprint(image_upload_bp, url_prefix="/api")

if __name__ == "__main__":
    # Use the port defined by the environment, default to 5000 for local testing
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
