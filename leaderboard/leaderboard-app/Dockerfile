FROM java:8
VOLUME /tmp
ADD target/leaderboard-app-0.0.1-SNAPSHOT.jar leaderboard.jar
EXPOSE "8081:8081"
RUN bash -c 'touch /leaderboard.jar'
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /leaderboard.jar"]