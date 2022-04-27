filename = "english-words.txt"
with open(filename) as file:
    lines = file.readlines()

lines = list(map(lambda l: f'\'{l.upper().strip()}\',\n',lines))
with open("EnglishWords.js", "a") as f:
    f.writelines(lines)
    f.close()
