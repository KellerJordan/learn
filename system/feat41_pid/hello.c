#include<stdio.h>
#include<string.h>
#include<unistd.h>

void sleepy(char* name, int n) {
    for (int i = 0; i < n; i++) {
        printf("%s: %d\n", name, i);
        sleep(1);
    }
}

void print_pids(char* name) {
    pid_t pid, ppid, sid;
    pid = getpid();
    ppid = getppid();
    sid = getsid(pid);
    printf("%s: pid=%d, ppid=%d, sid=%d\n", name, pid, ppid, sid);
}

int main() {
    int n = 0x12345678;
    char* s = (char*) &n;
    printf("%x %x %x %x\n", (int) s[0], (int) s[1], (int) s[2], (int) s[3]);
    return 0;

    if (fork() == 0) {
        print_pids("child");
        sleepy("child", 3);
    } else {
        print_pids("parent");
        sleepy("parent", 3);
    }

    return 0;
}
