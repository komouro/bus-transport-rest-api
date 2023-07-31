import click
import json
import requests

# Define the main command group for the CLI application
@click.group()
def main():
    """
    CLI for Appathon@Ntua 2020
    """
    pass


# Command for checking the health of the API
@main.command()
def HealthCheck():
    # Define the API endpoint URL
    url_format = "http://localhost:8765/Mouro/api/HealthCheck"
    url = url_format

    # Make a GET request to the API
    response = requests.get(url)

    # Format the JSON response for pretty printing
    printing_message = json.dumps(response.json(), indent=2)

    # Print the formatted response
    print(printing_message)


# Command for finding nearest stations based on latitude and longitude
@main.command()
@click.option('--lat', type=float, required=True)
@click.option('--lon', type=float, required=True)
@click.option('--num', type=int, required=True)
@click.option('--service', type=click.Choice(["web", "local"]), default="local")
def NearestStations(lat, lon, num, service):
    # Define the API endpoint URL
    url_format = "http://localhost:8765/Mouro/api/NearestStations"
    url = url_format + "/" + str(lat) + "/" + str(lon)
    url = url + "/" + str(num) + "/" + service

    # Make a GET request to the API
    response = requests.get(url)

    # Format the JSON response for pretty printing
    printing_message = json.dumps(response.json(), indent=2)

    # Print the formatted response
    print(printing_message)


# Command for finding connection routes between two points
@main.command()
@click.option('--lat_src', type=float, required=True)
@click.option('--lon_src', type=float, required=True)
@click.option('--lat_dst', type=float, required=True)
@click.option('--lon_dst', type=float, required=True)
@click.option('--num', type=int, required=True)
@click.option('--service', type=click.Choice(["web", "local"]), default="local")
def ConnectionRoutes(lat_src, lon_src, lat_dst, lon_dst, num, service):
    # Define the API endpoint URL
    url_format = "http://localhost:8765/Mouro/api/ConnectionRoutes"
    url = url_format + "/" + str(lat_src) + "/" + str(lon_src)
    url = url + "/" + str(lat_dst) + "/" + str(lon_dst)
    url = url + "/" + str(num) + "/" + service

    # Make a GET request to the API
    response = requests.get(url)

    # Format the JSON response for pretty printing
    printing_message = json.dumps(response.json(), indent=2)

    # Print the formatted response
    print(printing_message)


# Command for retrieving weather conditions for stations
@main.command()
@click.option('--stationtype', type=click.Choice(["source", "destination", "both"]), default="both")
@click.option('--service', type=click.Choice(["web", "local"]), default="local")
def WeatherConditions(stationtype, service):
    # Define the API endpoint URL
    url_format = "http://localhost:8765/Mouro/api/WeatherConditions"
    url = url_format + "/" + stationtype + "/" + service

    # Make a GET request to the API
    response = requests.get(url)

    # Format the JSON response for pretty printing
    printing_message = json.dumps(response.json(), indent=2)

    # Print the formatted response
    print(printing_message)


if __name__ == "__main__":
    # Execute the main CLI application
    main()

