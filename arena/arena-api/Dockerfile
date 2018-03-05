FROM java:8
VOLUME /tmp
ADD target/arena-api-0.0.1-SNAPSHOT.jar arena.jar
EXPOSE 8082
RUN bash -c 'touch /arena.jar'
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /arena.jar"]