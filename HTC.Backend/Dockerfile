FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["HTC.Backend.csproj", "HTC.Backend/"]
RUN dotnet restore "HTC.Backend/HTC.Backend.csproj"
COPY . HTC.Backend/
WORKDIR "/src/HTC.Backend"
RUN dotnet build "HTC.Backend.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "HTC.Backend.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "HTC.Backend.dll"]