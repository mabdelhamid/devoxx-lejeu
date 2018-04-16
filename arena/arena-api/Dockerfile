FROM java:8
VOLUME /tmp
ADD target/arena-api-0.0.1-SNAPSHOT.jar arena.jar
ENV JAVA_OPTS="-Djava.security.egd=file:/dev/./urandom"
EXPOSE 8082
RUN bash -c 'touch /arena.jar'
ENTRYPOINT ["sh", "-c", "java -Daneo.security.jwt.secretKey=$SECRET_KEY $JAVA_OPTS -jar /arena.jar"]