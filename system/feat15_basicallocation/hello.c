#include<stdio.h>
#include<stdlib.h>
#include<malloc.h>
#include<string.h>

int bigStack(int howBig, void* offset) {
    char myArr[howBig];
    bzero(&myArr, howBig);
    printf("did it @ %p (%ld)\n", &myArr, (long) &myArr - (long) offset);
}

int main(int argc, char** argv) {

    char* myStr = "blabla 8";

    int n = 9;
    char myArr[n];
    char *myAuto = alloca(n);
    char *myHeap = malloc(n);
    strcpy(myArr, myStr);
    strcpy(myAuto, myStr);
    strcpy(myHeap, myStr);

    printf("%p %p %p %p\n", &n, &myArr, myAuto, myHeap);

    printf("%s %s %s\n", myArr, myAuto, myHeap);

    bigStack(5, myHeap);
    bigStack(1000000, myHeap);


    return 0;
}

