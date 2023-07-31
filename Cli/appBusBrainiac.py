from cmd import Cmd
import os
from pathlib import Path


def bad_command_structure(scope):
    """
    Display an error message when an invalid or unrecognized method is entered.

    Parameters:
        scope (str): The command scope or name that caused the error.
    """
    if scope != '':
        print("'" + scope + "' : no such method found")
    print("Usage: BusBrainiac METHOD [ARGS]...")
    print("Methods:")
    print("  HealthCheck")
    print("  NearestStations --lat lat --lon lon --num num (--service service)")
    print("  ConnectionRoutes --lat_src lat_src --lon_src lon_src --lat_dst lat_dst --lon_dst lon_dst --num num (--service service)")
    print("  WeatherConditions (--stationtype stationtype) (--service service)")


def make_command_executable(command):
    """
    Make the given command executable by converting it into a valid command.

    Parameters:
        command (str): The input command to be converted.

    Returns:
        str: The fixed and executable CLI command.
    """
    # Extract the scope (first word) from the command
    scope = command.partition(' ')[0]

    # Dictionary to map original command names to fixed command names
    scope_dict = {'WeatherConditions': 'weatherconditions',
                  'ConnectionRoutes': 'connectionroutes',
                  'HealthCheck': 'healthcheck',
                  'NearestStations': 'neareststations'}

    # Check if the scope is in the dictionary, if not, display an error and return an empty string
    if scope in scope_dict:
        fixed_scope = scope_dict[scope]
    else:
        bad_command_structure(scope)  # Call the bad_command_structure function to display the error message
        return ''

    # Combine the fixed scope with the rest of the command (arguments and options)
    return (fixed_scope + " " + (command.partition(' ')[2]))


class MyPrompt(Cmd):
    print("Welcome the command-line-interface (cli) by Konstantinos Mourogiannis for Appathon@Ntua 2020. Enjoy!")
    prompt = '$ '
    def do_exit(self, inp):
        '''Exit the application.'''
        print("Bye")
        return True
    
    def do_cli_Manual(self, inp):
        '''Manual for the application.'''
        print("\n------------\n| Commands |\n------------\n")
        print("help                  Show a list of commands with 'help' or information for a particular command with 'help <cmd>'")
        print("cli_Manual            Show a list of commands with information on usage")
        print("BusBrainiac           Interact with cli using methods HealthCheck, NearestStations, ConnectionRoutes and WeatherConditions")
        print("exit                  Exit the cli-application")
        print()
        print("Usage of command BusBrainiac: BusBrainiac METHOD [ARGS]...")
        print("Methods:")
        print("  HealthCheck")
        print("  NearestStations --lat lat --lon lon --num num (--service service)")
        print("  ConnectionRoutes --lat_src lat_src --lon_src lon_src --lat_dst lat_dst --lon_dst lon_dst --num num (--service service)")
        print("  WeatherConditions (--stationtype stationtype) (--service service)")
    
    def do_BusBrainiac(self, inp):
        '''Interact with server (type cli_Manual to check usage).'''
        c = make_command_executable(inp)
        if c != '':
            command = "python ../Cli/cli.py " + c
            os.system(command)
            

if __name__ == '__main__':
    cli = MyPrompt()
    cli.cmdloop()
