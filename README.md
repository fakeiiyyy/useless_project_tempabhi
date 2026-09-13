<img width="1280" height="640" alt="git (1)" src="https://github.com/user-attachments/assets/8920b256-2ba8-4988-b824-5351134eb4bd" />



# BRAILLE CAPTIONS YT


## We are implementing braille captions for the yt exclusively for the blind.

### Team Name: Pseudosmart


### Team Members
- Team Lead: Sidharth Menon V - Saintgits college of engineering
- Member 2: Abhishek Reji - Saintgits college of engineering

### Project Description
our project is exclusively for blind people with full proof protection against the people who can see. this revolutionary project didplayes braille in dark and light modes. 
discliamer: no blind people where harmed in making this project.

### The Problem (that doesn't exist)
youtube has neglected what the blind community really wants, Braille Captions. we decided to do it. 

### The Solution (that nobody asked for)
by making live captions in yt for blind people.

## Technical Details
### Technologies/Components Used
For Software:
- **Languages used:** JavaScript (ES6+), JSON
- **Frameworks used:** None — built directly on the WebExtensions API (Manifest V3), no build tooling or bundler
- **Libraries used:** None — vanilla `MutationObserver`, DOM APIs, and a hand-written Grade-1 Braille lookup table (`BRAILLE_MAP`)
- **Tools used:** VS Code, Firefox Developer Edition (`about:debugging` for temporary add-on loading), Google Chrome (`chrome://extensions`, Developer Mode + Load Unpacked), Git/GitHub


### Implementation 
For Software:

# Installation
```bash
git clone https://github.com/<your-username>/braillie-captions.git
cd braillie-captions
```

No dependencies, no `npm install`, no build step — the extension runs straight from the source files. Minimalist engineering.

# Run

**Firefox:**
### Project Documentation
For Software:

# Screenshots (Add at least 3)
![Screenshot](<3.png>)
*first time the exetension is opened*

![Screenshot2](<4.png>)
*after pressing no*

![Screenshot3](<1.png>)
*barille subtitles in the dark mode*

![Screenshot4](<2.png>)
*subtitles in the light mode*

# Diagrams
![Workflow](<5.png>)
*Event-driven execution flow showing how the extension observes YouTube's DOM for closed captions, extracts live text, translates characters into Braille dot patterns, and updates the screen overlay.*

### Project Demo
# Video
[Watch Demo Video](https://drive.google.com/file/d/108xjR7m7OfQq4U0sByUfNQfamVZ7RjDd/view?usp=drive_link)

*Demonstrates the extension converting live YouTube captions into Braille dots in real time, tested in both Firefox and Chrome.*
*in the first screen we are asking "can you see" in braille script, there is an option "no", if the person clicks the butten we will ask "pinne ne enganada kuthiye?", the screen will be redirected to the previous screen after 5 seconds. if there is no action until 7 seconds in the first screen then we detect as he is a blind and we will redirect to the youtube and the person can scroll and find the video they need. we provide the captions in the screen if the subtitles is on. for the comfortability of the user we are provided both the dark mode and light mode.*



## Team Contributions
- Sidharth Menon V: code and design.
- Abhishek Reji: Documentation.

---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--26-26?link=https%3A%2F%2Ftinkerhub.org%2Fevents%2F1M8ORET9A1%2Fuseless-projects-3.0)



