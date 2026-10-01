# Stage 1 — Build the Spring Boot app
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
# Copy from backend/ folder (build context = repo root)
COPY backend/pom.xml .
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Stage 2 — Run with lightweight JRE
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
# NOTE: Do NOT hardcode SPRING_PROFILES_ACTIVE here
# Render injects it from Environment Variables (postgres / h2)
ENTRYPOINT ["java", "-jar", "-Dserver.port=${PORT:-8080}", "app.jar"]
