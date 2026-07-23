#!/usr/bin/env python3
"""
Backend API Tests for Malik Poultry Farm
Tests the /api/inquiries endpoint and related functionality
"""

import requests
import json
import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/.env')

BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'https://poultry-beverages-pk.preview.emergentagent.com')
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.getenv('DB_NAME', 'malik_poultry')

print(f"🔧 Configuration:")
print(f"   BASE_URL: {BASE_URL}")
print(f"   MONGO_URL: {MONGO_URL}")
print(f"   DB_NAME: {DB_NAME}")
print()

def test_health_endpoint():
    """Test 1: GET /api/health should return 200 with ok:true, service, and time"""
    print("=" * 80)
    print("TEST 1: GET /api/health")
    print("=" * 80)
    try:
        url = f"{BASE_URL}/api/health"
        response = requests.get(url, timeout=10)
        
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Response Body: {response.text}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected status 200, got {response.status_code}")
            return False
        
        data = response.json()
        
        if not data.get('ok'):
            print(f"❌ FAILED: Expected ok:true, got {data.get('ok')}")
            return False
        
        if data.get('service') != 'malik-poultry-api':
            print(f"❌ FAILED: Expected service:'malik-poultry-api', got {data.get('service')}")
            return False
        
        if not data.get('time'):
            print(f"❌ FAILED: Expected time field, got {data.get('time')}")
            return False
        
        print("✅ PASSED: Health endpoint working correctly")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {str(e)}")
        return False

def test_post_inquiry_valid():
    """Test 2: POST /api/inquiries with valid payload should return 200 with ok:true and id"""
    print("\n" + "=" * 80)
    print("TEST 2: POST /api/inquiries with valid payload")
    print("=" * 80)
    try:
        url = f"{BASE_URL}/api/inquiries"
        payload = {
            "name": "Ahmed Khan",
            "phone": "+923001234567",
            "message": "I would like to inquire about Fresh Chicken."
        }
        headers = {'Content-Type': 'application/json'}
        
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Response Body: {response.text}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected status 200, got {response.status_code}")
            return False, None
        
        data = response.json()
        
        if not data.get('ok'):
            print(f"❌ FAILED: Expected ok:true, got {data.get('ok')}")
            return False, None
        
        inquiry_id = data.get('id')
        if not inquiry_id or not isinstance(inquiry_id, str):
            print(f"❌ FAILED: Expected id (UUID string), got {inquiry_id}")
            return False, None
        
        print(f"✓ Inquiry ID: {inquiry_id}")
        print("✅ PASSED: Valid inquiry created successfully")
        return True, inquiry_id
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {str(e)}")
        return False, None

def test_mongodb_persistence(inquiry_id):
    """Test 3: Verify the inquiry was saved to MongoDB"""
    print("\n" + "=" * 80)
    print("TEST 3: Verify MongoDB persistence")
    print("=" * 80)
    try:
        client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=5000)
        db = client[DB_NAME]
        collection = db['inquiries']
        
        # Find the document by id
        doc = collection.find_one({'id': inquiry_id})
        
        if not doc:
            print(f"❌ FAILED: Document with id {inquiry_id} not found in MongoDB")
            client.close()
            return False
        
        print(f"✓ Document found in MongoDB:")
        print(f"   id: {doc.get('id')}")
        print(f"   name: {doc.get('name')}")
        print(f"   phone: {doc.get('phone')}")
        print(f"   message: {doc.get('message')}")
        print(f"   createdAt: {doc.get('createdAt')}")
        
        # Verify fields
        if doc.get('name') != 'Ahmed Khan':
            print(f"❌ FAILED: Expected name 'Ahmed Khan', got {doc.get('name')}")
            client.close()
            return False
        
        if doc.get('phone') != '+923001234567':
            print(f"❌ FAILED: Expected phone '+923001234567', got {doc.get('phone')}")
            client.close()
            return False
        
        if 'Fresh Chicken' not in doc.get('message', ''):
            print(f"❌ FAILED: Expected message to contain 'Fresh Chicken', got {doc.get('message')}")
            client.close()
            return False
        
        if not doc.get('createdAt'):
            print(f"❌ FAILED: Expected createdAt timestamp, got {doc.get('createdAt')}")
            client.close()
            return False
        
        print("✅ PASSED: Document persisted correctly in MongoDB")
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {str(e)}")
        return False

def test_validation_empty_name():
    """Test 4a: POST /api/inquiries with empty name should return 400"""
    print("\n" + "=" * 80)
    print("TEST 4a: POST /api/inquiries with empty name")
    print("=" * 80)
    try:
        url = f"{BASE_URL}/api/inquiries"
        payload = {
            "name": "",
            "phone": "+923000000000",
            "message": "hi"
        }
        headers = {'Content-Type': 'application/json'}
        
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Response Body: {response.text}")
        
        if response.status_code != 400:
            print(f"❌ FAILED: Expected status 400, got {response.status_code}")
            return False
        
        data = response.json()
        if not data.get('error'):
            print(f"❌ FAILED: Expected error message, got {data}")
            return False
        
        print("✅ PASSED: Empty name validation working")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {str(e)}")
        return False

def test_validation_missing_name():
    """Test 4b: POST /api/inquiries without name field should return 400"""
    print("\n" + "=" * 80)
    print("TEST 4b: POST /api/inquiries without name field")
    print("=" * 80)
    try:
        url = f"{BASE_URL}/api/inquiries"
        payload = {
            "phone": "+923000000000",
            "message": "hi"
        }
        headers = {'Content-Type': 'application/json'}
        
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Response Body: {response.text}")
        
        if response.status_code != 400:
            print(f"❌ FAILED: Expected status 400, got {response.status_code}")
            return False
        
        data = response.json()
        if not data.get('error'):
            print(f"❌ FAILED: Expected error message, got {data}")
            return False
        
        print("✅ PASSED: Missing name validation working")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {str(e)}")
        return False

def test_validation_missing_phone():
    """Test 4c: POST /api/inquiries without phone field should return 400"""
    print("\n" + "=" * 80)
    print("TEST 4c: POST /api/inquiries without phone field")
    print("=" * 80)
    try:
        url = f"{BASE_URL}/api/inquiries"
        payload = {
            "name": "Test User",
            "message": "hi"
        }
        headers = {'Content-Type': 'application/json'}
        
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Response Body: {response.text}")
        
        if response.status_code != 400:
            print(f"❌ FAILED: Expected status 400, got {response.status_code}")
            return False
        
        data = response.json()
        if not data.get('error'):
            print(f"❌ FAILED: Expected error message, got {data}")
            return False
        
        print("✅ PASSED: Missing phone validation working")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {str(e)}")
        return False

def test_options_cors():
    """Test 5: OPTIONS /api/inquiries should return 204 with CORS headers"""
    print("\n" + "=" * 80)
    print("TEST 5: OPTIONS /api/inquiries (CORS preflight)")
    print("=" * 80)
    try:
        url = f"{BASE_URL}/api/inquiries"
        response = requests.options(url, timeout=10)
        
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Response Headers:")
        for key, value in response.headers.items():
            if 'access-control' in key.lower():
                print(f"   {key}: {value}")
        
        if response.status_code != 204:
            print(f"❌ FAILED: Expected status 204, got {response.status_code}")
            return False
        
        # Check CORS headers
        headers = {k.lower(): v for k, v in response.headers.items()}
        
        if 'access-control-allow-origin' not in headers:
            print(f"❌ FAILED: Missing Access-Control-Allow-Origin header")
            return False
        
        if 'access-control-allow-methods' not in headers:
            print(f"❌ FAILED: Missing Access-Control-Allow-Methods header")
            return False
        
        if 'access-control-allow-headers' not in headers:
            print(f"❌ FAILED: Missing Access-Control-Allow-Headers header")
            return False
        
        print("✅ PASSED: CORS preflight working correctly")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {str(e)}")
        return False

def test_malformed_json():
    """Test 6: POST /api/inquiries with malformed JSON should handle gracefully"""
    print("\n" + "=" * 80)
    print("TEST 6: POST /api/inquiries with malformed JSON")
    print("=" * 80)
    try:
        url = f"{BASE_URL}/api/inquiries"
        headers = {'Content-Type': 'application/json'}
        
        # Send raw string instead of JSON
        response = requests.post(url, data="not json", headers=headers, timeout=10)
        
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Response Body: {response.text}")
        
        # Should return 400 (validation error) or handle gracefully without crashing
        if response.status_code not in [200, 400]:
            print(f"❌ FAILED: Expected status 200 or 400, got {response.status_code}")
            return False
        
        # If it returns 400, it should have an error message
        if response.status_code == 400:
            data = response.json()
            if not data.get('error'):
                print(f"❌ FAILED: Expected error message for 400 response")
                return False
        
        print("✅ PASSED: Malformed JSON handled gracefully")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {str(e)}")
        return False

def test_unknown_route():
    """Test 7: GET /api/nonexistent should return 404"""
    print("\n" + "=" * 80)
    print("TEST 7: GET /api/nonexistent (unknown route)")
    print("=" * 80)
    try:
        url = f"{BASE_URL}/api/nonexistent"
        response = requests.get(url, timeout=10)
        
        print(f"✓ Status Code: {response.status_code}")
        print(f"✓ Response Body: {response.text}")
        
        if response.status_code != 404:
            print(f"❌ FAILED: Expected status 404, got {response.status_code}")
            return False
        
        print("✅ PASSED: Unknown route returns 404")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {str(e)}")
        return False

def main():
    """Run all backend tests"""
    print("\n" + "=" * 80)
    print("🧪 MALIK POULTRY FARM - BACKEND API TESTS")
    print("=" * 80)
    print()
    
    results = {}
    
    # Test 1: Health endpoint
    results['health'] = test_health_endpoint()
    
    # Test 2: Valid inquiry POST
    success, inquiry_id = test_post_inquiry_valid()
    results['post_valid'] = success
    
    # Test 3: MongoDB persistence (only if Test 2 passed)
    if success and inquiry_id:
        results['mongodb'] = test_mongodb_persistence(inquiry_id)
    else:
        results['mongodb'] = False
        print("\n⚠️  Skipping MongoDB test (no inquiry_id from previous test)")
    
    # Test 4: Validation errors
    results['validation_empty_name'] = test_validation_empty_name()
    results['validation_missing_name'] = test_validation_missing_name()
    results['validation_missing_phone'] = test_validation_missing_phone()
    
    # Test 5: CORS preflight
    results['cors'] = test_options_cors()
    
    # Test 6: Malformed JSON
    results['malformed_json'] = test_malformed_json()
    
    # Test 7: Unknown route
    results['unknown_route'] = test_unknown_route()
    
    # Summary
    print("\n" + "=" * 80)
    print("📊 TEST SUMMARY")
    print("=" * 80)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{status}: {test_name}")
    
    print()
    print(f"Total: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED! Backend API is working correctly.")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please review the failures above.")
        return 1

if __name__ == '__main__':
    exit(main())
