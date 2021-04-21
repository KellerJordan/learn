#include<stdio.h>
#include<unistd.h>
#include<fcntl.h>
#include<errno.h>
#include<stdlib.h>
#include<string.h>
#include<wait.h>
#include<sys/mman.h>
#include<sys/stat.h>

typedef struct Person {
    int age;
    char name[25];
} person_t;

void pperson(struct Person p) {
    printf("%s age %d\n", p.name, p.age);
}

int main() {
    struct Person p1;
    p1.age = 8;
    strcpy(p1.name, "Johnny");
    pperson(p1);

    struct Person p2 = {
        .age = 7,
        .name = "Victoria",
    };
    pperson(p2);

    person_t p3 = {
        .age = 11,
        .name = "Carson",
    };
    pperson(p3);

    printf("pperson is @ %p\n", pperson);

    return 0;
}

