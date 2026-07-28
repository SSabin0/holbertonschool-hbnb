#!/usr/bin/python3
import unittest
from app.models.user import User
from app.models.place import Place
from app.models.review import Review
from app.models.amenity import Amenity
from app import bcrypt

class ModelSetUp():

    def __init__(self):
        self.user1 = User(
                first_name="John",
                last_name="Doe",
                email="john.doe@example.com",
                password="password"
                )
        self.user2 = User(
                first_name="Jonathon",
                last_name="Clus",
                email="jon.clus@holberton.com",
                password="password"
                )
        self.place1 = Place(
                "Holberton",
                "It's cool",
                20.0,
                -37.8174123,
                144.9592932,
                self.user1.id
                )
        self.review1 = Review(
                "Informative.",
                4,
                self.place1.id,
                self.user1.id
                )
        self.amenity1 = Amenity(
                "Wi-Fi"
                )


class TestUserCreation(unittest.TestCase):

    def setUp(self):
        self.models = ModelSetUp()

    def test_standard_creation(self):
        self.assertEqual(self.models.user1.first_name, "John")
        self.assertEqual(self.models.user1.last_name, "Doe")
        self.assertEqual(self.models.user1.email, "john.doe@example.com")
        self.assertEqual(self.models.user1.is_admin, False)  # Default value

    def test_update_names(self):
        # Change names
        self.models.user1.first_name = "Mary"
        self.assertEqual(self.models.user1.first_name, "Mary")
        self.models.user1.last_name= "Sue"
        self.assertEqual(self.models.user1.last_name, "Sue")
        # Wrong type
        with self.assertRaises(TypeError):
            self.models.user1.first_name = 1
        with self.assertRaises(TypeError):
            self.models.user1.last_name = 2
        with self.assertRaises(TypeError):
            self.models.user1.last_name = None
        with self.assertRaises(TypeError):
            self.models.user1.last_name = None
        with self.assertRaises(TypeError):
            self.models.user1.first_name = ['string']
        with self.assertRaises(TypeError):
            self.models.user1.last_name = ['string']
        # Wrong length
        with self.assertRaises(ValueError):
            self.models.user1.first_name = ""
        with self.assertRaises(ValueError):
            self.models.user1.last_name = ""
        with self.assertRaises(ValueError):
            self.models.user1.first_name = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        with self.assertRaises(ValueError):
            self.models.user1.last_name = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"

    def test_update_email(self):
        # Change email
        self.models.user1.email = "test@mail.com"
        self.assertEqual(self.models.user1.email, "test@mail.com")
        # Wrong type
        with self.assertRaises(TypeError):
            self.models.user1.email = 1
        with self.assertRaises(TypeError):
            self.models.user1.email = None
        with self.assertRaises(TypeError):
            self.models.user1.email = {'str': 'ing'}
        # Empty
        with self.assertRaises(ValueError):
            self.models.user1.email = ""
        # Format
        with self.assertRaises(ValueError):
            self.models.user1.email = "test"
        with self.assertRaises(ValueError):
            self.models.user1.email = "test@website"
        with self.assertRaises(ValueError):
            self.models.user1.email = "t@s.t"

    def test_update_password(self):
        self.models.user1.password = "StrongPWD"
        self.assertNotEqual(self.models.user1.password, "StrongPWD")
        self.assertTrue(self.models.user1.verify_password("StrongPWD"))

class TestPlaceCreation(unittest.TestCase):
    
    def setUp(self):
        self.models = ModelSetUp()

    def test_standard_creation(self):
        self.assertEqual(self.models.place1.title, "Holberton")
        self.assertEqual(self.models.place1.description, "It's cool")
        self.assertEqual(self.models.place1.price, 20.0)
        self.assertEqual(self.models.place1.latitude, -37.8174123)
        self.assertEqual(self.models.place1.longitude, 144.9592932)
        self.assertEqual(self.models.user1.id, self.models.place1.owner_id)

class TestReviewCreation(unittest.TestCase):

    def setUp(self):
        self.models = ModelSetUp()

    def test_standard_creation(self):
        self.assertEqual("Informative.", self.models.review1.text)
        self.assertEqual(4, self.models.review1.rating)
        self.assertEqual(self.models.user1.id, self.models.review1.user_id)

class TestAmenityCreation(unittest.TestCase):

    def setUp(self):
        self.models = ModelSetUp()

    def test_standard_creation(self):
        self.assertEqual("Wi-Fi", self.models.amenity1.name)

if __name__ == '__main__':
    unittest.main()
