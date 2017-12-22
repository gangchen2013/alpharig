resource "aws_instance" "apiserver" {
  count         = "${var.worker["nodes"]}"
  key_name      = "${var.key_name}"
  ami           = "${var.worker["ami"]}"
  instance_type = "${var.worker["type"]}"
  subnet_id     = "${aws_subnet.dev_public_subnet.id}"
  vpc_security_group_ids = [ "${aws_security_group.dev_sec_group.id}" ]

  root_block_device {
    volume_size = "${var.worker["disk"]}"
  }
  tags {
    Name = "${format("${var.instance_name}-worker%01d", count.index + 1) }"
  }
  user_data = <<EOF
#!/bin/bash
echo "${format("${var.instance_name}-worker%1d", count.index + 1)}" > /etc/hostname
hostname ${format("${var.instance_name}-worker%1d", count.index + 1)}
EOF
}
