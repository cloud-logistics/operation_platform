#!/usr/bin/expect -f

set password "pkzngmcxsf"
set timeout -1
set PATH "/usr/share/nginx/html/cloudbox"
set FILE_NAME [lindex $argv 0]
set FULL_NAME [lindex $argv 1]


# 删除服务器上原有文件
spawn ssh root@106.2.20.185
expect {
    "*yes/no" {send "yes\r"; exp_continue}
    "*assword:*" {send "$password\r"}
}

expect "#*"
send  "rm -rf ${PATH}/*\r"
send  "exit\r"


# 拷贝压缩包到服务器
spawn scp ${FULL_NAME} root@106.2.20.185:${PATH}
expect {
 "(yes/no)?"
  {
  send "yes\n"
  expect "*assword:" { send "$password\n"}
  }

  "*assword:"
 {
  send "$password\n"
 }
}
expect "*$ "
# send  "exit\r"


# 解压服务器上的文件
spawn ssh root@106.2.20.185
expect {
    "*yes/no" {send "yes\r"; exp_continue}
    "*assword:*" {send "$password\r"}
}

expect "#*"
send "unzip ${PATH}/${FILE_NAME} -d ${PATH} \r"

expect eof
# interact
