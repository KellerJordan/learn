#include<stdio.h>
#include<unistd.h>
#include<stdlib.h>
#include<sys/socket.h>
#include<net/if.h>

int main() {
    unsigned int idx = if_nametoindex("eth0");
    char name[50];
    if_indextoname(idx, name);
    //printf("%d %s\n", idx, name);

    struct if_nameindex* niptr;
    niptr = if_nameindex();
    int i = 0;
    while (niptr[i].if_index != 0) {
        printf("%d %s\n", niptr[i].if_index, niptr[i].if_name);
        i++;
    }
    if_freenameindex(niptr);

    char* ptr = malloc(50);
    int n = 9;
    printf("%p %p %p %p\n", &n, ptr, niptr, niptr[1].if_name);

    return 0;
}

