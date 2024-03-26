from deepface import DeepFace
import os

def detect_and_match_face(image_path, reference_image_path):
    # Detect faces in the image
    detected_faces = DeepFace.detectFace(image_path)

    # Check if at least one face is detected
    if len(detected_faces) > 0:
        # Check if the entire face is matched
        result = DeepFace.verify(image_path, reference_image_path)

        return result["verified"]

    return False

def process_images_in_directory(directory_path, reference_image_path):
    for filename in os.listdir(directory_path):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            image_path = os.path.join(directory_path, filename)

            if detect_and_match_face(image_path, reference_image_path):
                print(f"Face matched successfully for image: {filename}")
            else:
                print(f"No face detected or matching failed for image: {filename}")

# Example usage:
directory_path = 'C:/A_Local_disk_D/POC/Game_poc/colorfantasy/backend/uploads/'
reference_image_path = 'C:/A_Local_disk_D/POC/Game_poc/colorfantasy/backend/uploads/images.jpeg'

process_images_in_directory(directory_path, reference_image_path)
