#!/usr/bin/env python3
"""
Test runner for Idea Garden API tests.
"""

import subprocess
import sys
import os

def run_tests():
    """Run the test suite."""
    print("🧪 Running Idea Garden API Tests...")
    print("=" * 50)
    
    # Change to the api directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Run pytest
    result = subprocess.run([
        sys.executable, "-m", "pytest", 
        "tests/", 
        "-v", 
        "--tb=short",
        "--color=yes"
    ], capture_output=False)
    
    if result.returncode == 0:
        print("\n✅ All tests passed!")
    else:
        print("\n❌ Some tests failed!")
        sys.exit(1)

if __name__ == "__main__":
    run_tests() 