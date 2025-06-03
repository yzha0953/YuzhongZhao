FROM amazonlinux:1
WORKDIR /
RUN yum update -y
# Install Python 3.7
RUN yum install gcc openssl-devel wget tar -y
RUN wget https://www.python.org/ftp/python/3.8.9/Python-3.8.9.tgz
RUN tar -xzvf Python-3.8.9.tgz
WORKDIR /Python-3.8.9
RUN ./configure --enable-optimizations
RUN make install
# Install Python packages
RUN mkdir /packages
RUN echo "opencv-python-headless" >> /packages/requirements.txt
RUN mkdir -p /packages/opencv-python-3.8/python/lib/python3.8/site-packages
RUN pip3.8 install -r /packages/requirements.txt -t /packages/opencv-python-3.8/python/lib/python3.8/site-packages
