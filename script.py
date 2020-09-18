#!/usr/bin/python
import argparse

def Main():
    parser = argparse.ArgumentParser()
    parser.add_argument("club1", help="Enter a club", type=str)
    args = parser.parse_args()
    print(args.club1)

if __name__ == "__main__":
    Main()
