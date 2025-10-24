// C++ program to check fixed point
// in an array using linear search
#include <bits/stdc++.h>
using namespace std;

int fixedPoint(vector<int> &arr) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == i)
            return i;
    }

    // If no fixed point is found
    return -1;
}

int main() {
    vector<int> arr = { -10, -5, 0, 3, 7};
    cout<<fixedPoint(arr);
    return 0;
}
