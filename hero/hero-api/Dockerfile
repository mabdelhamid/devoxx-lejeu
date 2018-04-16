FROM java:8
VOLUME /tmp
ADD target/hero-api-0.0.1-SNAPSHOT.jar hero.jar
ENV JAVA_OPTS="-Djava.security.egd=file:/dev/./urandom"
EXPOSE 8080
RUN bash -c 'touch /hero.jar'
ENTRYPOINT ["sh", "-c", "java -Daneo.security.jwt.secretKey=$SECRET_KEY $JAVA_OPTS -jar /hero.jar"]