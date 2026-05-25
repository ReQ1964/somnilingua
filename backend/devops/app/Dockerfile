# === Build stage ===
FROM amazoncorretto:25-jdk AS build

WORKDIR /app

# Copy only necessary files for dependency resolution
COPY pom.xml .
COPY .mvn/ .mvn/
COPY mvnw .

# Pre-fetch dependencies (helps with caching)
RUN --mount=type=secret,id=maven_settings,target=/root/.m2/settings.xml \
    ./mvnw dependency:go-offline -B

# Copy the source code and build the JAR
COPY src/ src/
RUN --mount=type=secret,id=maven_settings,target=/root/.m2/settings.xml \
    ./mvnw clean package -B -DskipTests

# === Runtime stage ===
FROM amazoncorretto:25-jdk

WORKDIR /app

# Copy the JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

ENV PORT = 8080

EXPOSE 8080

# Use ENTRYPOINT for flexibility and CMD for defaults
ENTRYPOINT ["sh", "-c", "java -Dserver.port=$PORT -jar app.jar"]