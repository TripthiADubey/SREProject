#!/bin/bash

# List of minions
minions=("cat" "tiger" "lion" "panthera" "leopard" "cheetah" "jaguar")
#minions=("lion" "panthera" "leopard")
# List of commands to send to each minion
commands=(
   "tree"
   "du"
   "whoami"
   "pwd"
)

# Function to send a command to a specific minion
send_command_to_minion() {
    local minion="$1"
    local command="$2"
    sudo salt "$minion" cmd.run "$command"
}

# Main function
main() {
    # Loop over each minion
    for minion in "${minions[@]}"; do
        echo "Sending commands to $minion..."
        
        # Loop over each command and send it to the current minion
        for command in "${commands[@]}"; do
            echo "Executing: $command on $minion"
            # Send the command and capture the output
            output=$(send_command_to_minion "$minion" "$command" 2>&1)
            # Check if the command was successful
            if [ $? -eq 0 ]; then
                echo "Success: $output"
            else
                echo "Error executing $command on $minion: $output"
            fi
        done
    done
}

# Call main function
main

