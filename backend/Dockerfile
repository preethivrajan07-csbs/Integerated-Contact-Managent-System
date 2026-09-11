# Stage 1 — Build the Spring Boot app
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
# Copy from backend/ folder (since Render builds from repo root)
COPY backend/pom.xml .
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Stage 2 — Run the Spring Boot app with lightweight JRE
FROM eclipse-temurin:17-jre
WORKDIR /app
# Use wildcard to copy whatever jar was built
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=h2
ENTRYPOINT ["java", "-jar", "app.jar"]
