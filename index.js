const rankedIds = require('./RankedReportIds.json')
const parseReport = require('salem-trial-parser')
const fs = require('fs')
const nGram = require('n-gram')
const colors = require('colors')

'use strict'

let rolelist = `Blackmailer
BM
BMr
BMer
Consigliere
consig
Consort
Disguiser
disg
dis
Framer
Forger
Godfather
gf
Janitor
jan
janny
jany
jani
Mafioso
maf
Hypnotist
Ambusher
BodyGuard
bg
Crusader
Psychic
Doctor
doc
Escort
esc
Investigator
inv
invest
investi
Jailor
jailer
Lookout
lo
Mayor
Medium
med
Retributionist
ret
retri
Sheriff
sher
sherriff
sherrif
sheri
sherri
Spy
Transporter
tran
trans
Trapper
Veteran
vet
Tracker
Vigilante
vig
vigi
VampireHunter
Amnesiac
Arsonist
arso
Executioner
exe
exec
Jester
jest
Serial Killer
sk
Survivor
Witch
Werewolf
ww`.toUpperCase().split('\n')

function deAbbreviate(role) {
  role = role.replace(/\bEXE\b/, 'EXECUTIONER')
  role = role.replace(/\bEXEC\b/, 'EXECUTIONER')
  role = role.replace(/\bBM\b/, 'BLACKMAILER')
  role = role.replace(/\bBMR\b/, 'BLACKMAILER')
  role = role.replace(/\bBMER\b/, 'BLACKMAILER')
  role = role.replace(/\bCONSIG\b/, 'CONSIGLIERE')
  role = role.replace(/\bDIS\b/, 'DISGUISER')
  role = role.replace(/\bDISG\b/, 'DISGUISER')
  role = role.replace(/\bGF\b/, 'GODFATHER')
  role = role.replace(/\bJAN\b/, 'JANITOR')
  role = role.replace(/\bJANI\b/, 'JANITOR')
  role = role.replace(/\bJANY\b/, 'JANITOR')
  role = role.replace(/\bJANNI\b/, 'JANITOR')
  role = role.replace(/\bJANNY\b/, 'JANITOR')
  role = role.replace(/\bMAF\b/, 'MAFIA')
  role = role.replace(/\bBG\b/, 'BODYGUARD')
  role = role.replace(/\bDOC\b/, 'DOCTOR')
  role = role.replace(/\bESC\b/, 'ESCORT')
  role = role.replace(/\bINV\b/, 'INVESTIGATOR')
  role = role.replace(/\bINVEST\b/, 'INVESTIGATOR')
  role = role.replace(/\bINVESTI\b/, 'INVESTIGATOR')
  role = role.replace(/\bJAILER\b/, 'JAILOR')
  role = role.replace(/\bLO\b/, 'LOOKOUT')
  role = role.replace(/\bMED\b/, 'MEDIUM')
  role = role.replace(/\bRET\b/, 'RETRIBUTIONIST')
  role = role.replace(/\bRETRI\b/, 'RETRIBUTIONIST')
  role = role.replace(/\bRETRIB\b/, 'RETRIBUTIONIST')
  role = role.replace(/\bSHER\b/, 'SHERIFF')
  role = role.replace(/\bSHERRIFF\b/, 'SHERIFF')
  role = role.replace(/\bSHERRIF\b/, 'SHERIFF')
  role = role.replace(/\bSHERI\b/, 'SHERIFF')
  role = role.replace(/\bSHERRI\b/, 'SHERIFF')
  role = role.replace(/\bTRAN\b/, 'TRANSPORTER')
  role = role.replace(/\bTRANS\b/, 'TRANSPORTER')
  role = role.replace(/\bVET\b/, 'VETERAN')
  role = role.replace(/\bVIG\b/, 'VIGILANTE')
  role = role.replace(/\bVIGI\b/, 'VIGILANTE')
  role = role.replace(/\bARSO\b/, 'ARSONIST')
  role = role.replace(/\bEXE\b/, 'EXECUTIONER')
  role = role.replace(/\bEXEC\b/, 'EXECUTIONER')
  role = role.replace(/\bJEST\b/, 'JESTER')
  role = role.replace(/\bSK\b/, 'SERIAL KILLER')
  role = role.replace(/\bSERIALKILLER\b/, 'SERIAL KILLER')
  role = role.replace(/\bWW\b/, 'WEREWOLF')
  role = role.replace(/\bINNO\b/, 'INNOCENT')
  role = role.replace(/\bTS\b/, 'TOWN SUPPORT')
  role = role.replace(/\bTK\b/, 'TOWN KILLING')
  role = role.replace(/\bTOWN KILLER\b/, 'TOWN KILLING')
  role = role.replace(/\bRT\b/, 'RANDOM TOWN')
  role = role.replace(/\bRM\b/, 'RANDOM MAFIA')
  role = role.replace(/\bTI\b/, 'TOWN INVESTIGATIVE')
  role = role.replace(/\bTOWN INV\b/, 'TOWN INVESTIGATIVE')
  role = role.replace(/\bTOWN INVEST\b/, 'TOWN INVESTIGATIVE')
  role = role.replace(/\bTOWN INVESTI\b/, 'TOWN INVESTIGATIVE')
  role = role.replace(/\bTOWN INVESTIGATOR\b/, 'TOWN INVESTIGATIVE')
  role = role.replace(/\bTP\b/, 'TOWN PROTECTIVE')
  role = role.replace(/\bTP\b/, 'TOWN PROTECTOR')
  role = role.replace(/\bNE\b/, 'NEUTRAL EVIL')
  role = role.replace(/\bNEUT\b/, 'NEUTRAL')
  role = role.replace(/\bNK\b/, 'NEUTRAL KILLER')
  return role
}


let defaultNames = `Cotton Mather
Deodat Lawson
Edward Bishop
Giles Corey
James Bayley
James Russel
John Hathorne
John Proctor
John Willard
Jonathan Corwin
Samuel Parris
Samuel Sewall
Thomas Danforth
William Hobbs
William Phips
Abigail Hobbs
Alice Parker
Alice Young
Ann Hibbins
Ann Putnam
Ann Sears
Betty Parris
Dorothy Good
Lydia Dustin
Martha Corey
Mary Eastey
Mary Johnson
Mary Warren
Sarah Bishop
Sarah Good
Sarah Wildes`.split('\n')

let stopwords = ["a", "a's", "able", "about", "above", "according", "accordingly", "across", "actually", "after", "afterwards", "again", "against", "ain't", "all", "allow", "allows", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "an", "and", "another", "any", "anybody", "anyhow", "anyone", "anything", "anyway", "anyways", "anywhere", "apart", "appear", "appreciate", "appropriate", "are", "aren't", "around", "as", "aside", "ask", "asking", "associated", "at", "available", "away", "awfully", "b", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "behind", "being", "believe", "below", "beside", "besides", "best", "better", "between", "beyond", "both", "brief", "but", "by", "c", "c'mon", "c's", "came", "can", "can't", "cannot", "cant", "cause", "causes", "certain", "certainly", "changes", "clearly", "co", "com", "come", "comes", "concerning", "consequently", "consider", "considering", "contain", "containing", "contains", "corresponding", "could", "couldn't", "course", "currently", "d", "definitely", "described", "despite", "did", "didn't", "different", "do", "does", "doesn't", "doing", "don't", "done", "down", "downwards", "during", "e", "each", "edu", "eg", "eight", "either", "else", "elsewhere", "enough", "entirely", "especially", "et", "etc", "even", "ever", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "f", "far", "few", "fifth", "first", "five", "followed", "following", "follows", "for", "former", "formerly", "forth", "four", "from", "further", "furthermore", "g", "get", "gets", "getting", "given", "gives", "go", "goes", "going", "gone", "got", "gotten", "greetings", "h", "had", "hadn't", "happens", "hardly", "has", "hasn't", "have", "haven't", "having", "he", "he's", "hello", "help", "hence", "her", "here", "here's", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "hi", "him", "himself", "his", "hither", "hopefully", "how", "howbeit", "however", "i", "i'd", "i'll", "i'm", "i've", "ie", "if", "ignored", "immediate", "in", "inasmuch", "inc", "indeed", "indicate", "indicated", "indicates", "inner", "insofar", "instead", "into", "inward", "is", "isn't", "it", "it'd", "it'll", "it's", "its", "itself", "j", "just", "k", "keep", "keeps", "kept", "know", "known", "knows", "l", "last", "lately", "later", "latter", "latterly", "least", "less", "lest", "let", "let's", "like", "liked", "likely", "little", "look", "looking", "looks", "ltd", "m", "mainly", "many", "may", "maybe", "me", "mean", "meanwhile", "merely", "might", "more", "moreover", "most", "mostly", "much", "must", "my", "myself", "n", "name", "namely", "nd", "near", "nearly", "necessary", "need", "needs", "neither", "never", "nevertheless", "new", "next", "nine", "no", "nobody", "non", "none", "noone", "nor", "normally", "not", "nothing", "novel", "now", "nowhere", "o", "obviously", "of", "off", "often", "oh", "ok", "okay", "old", "on", "once", "one", "ones", "only", "onto", "or", "other", "others", "otherwise", "ought", "our", "ours", "ourselves", "out", "outside", "over", "overall", "own", "p", "particular", "particularly", "per", "perhaps", "placed", "please", "plus", "possible", "presumably", "probably", "provides", "q", "que", "quite", "qv", "r", "rather", "rd", "re", "really", "reasonably", "regarding", "regardless", "regards", "relatively", "respectively", "right", "s", "said", "same", "saw", "say", "saying", "says", "second", "secondly", "see", "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious", "seriously", "seven", "several", "shall", "she", "should", "shouldn't", "since", "six", "so", "some", "somebody", "somehow", "someone", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "specified", "specify", "specifying", "still", "sub", "such", "sup", "sure", "t", "t's", "take", "taken", "tell", "tends", "th", "than", "thank", "thanks", "thanx", "that", "that's", "thats", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "there's", "thereafter", "thereby", "therefore", "therein", "theres", "thereupon", "these", "they", "they'd", "they'll", "they're", "they've", "think", "third", "this", "thorough", "thoroughly", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "took", "toward", "towards", "tried", "tries", "truly", "try", "trying", "twice", "two", "u", "un", "under", "unfortunately", "unless", "unlikely", "until", "unto", "up", "upon", "us", "use", "used", "useful", "uses", "using", "usually", "uucp", "v", "value", "various", "very", "via", "viz", "vs", "w", "want", "wants", "was", "wasn't", "way", "we", "we'd", "we'll", "we're", "we've", "welcome", "well", "went", "were", "weren't", "what", "what's", "whatever", "when", "whence", "whenever", "where", "where's", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "who's", "whoever", "whole", "whom", "whose", "why", "will", "willing", "wish", "with", "within", "without", "won't", "wonder", "would", "wouldn't", "x", "y", "yes", "yet", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves", "z", "zero"]
for (let i = 0; i < stopwords.length; i++) {
  stopwords[i] = stopwords[i].toUpperCase().replace(/'/g, '')
}
function removeStopwords(str) {
  let res = []
  let wrds = str.split(' ')
  for (i = 0; i < wrds.length; i++) {
    if (!stopwords.includes(wrds[i])) {
      res.push(wrds[i])
    }
  }
  return (res.join(' '))
}

function spaceCount(str) {
  return count(str, ' ')
}

function HASH(str) {
  let hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
};

function count(main_str, sub_str) {
  main_str += '';
  sub_str += '';
  if (sub_str.length <= 0) {
    return main_str.length + 1;
  }
  subStr = sub_str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return (main_str.match(new RegExp(subStr, 'gi')) || []).length;
}

function avg(array) {
  return array.reduce((p, c, i) => { return p + (c - p) / (i + 1) }, 0)
}

function pad(n) {
  return n.toString().padStart(3, '0')
}

let I = 0
let interval = setInterval(() => {
  let filename = `D:/Users/MEL/Documents/reports/${rankedIds[I]}.html`
  let reportId = rankedIds[I]
  parseReport(filename).then((report) => {
    doStuff(report, reportId)
  }).catch((e) => { console.log(e) })
  if (I == (rankedIds.length - 1)) {
    clearInterval(interval)
  }
  I++
}, .5)

let stream1 = fs.createWriteStream('output1.json', { flags: 'a' });
let stream2 = fs.createWriteStream('output2.json', { flags: 'a' });

let dupeCount = 0
let dupes = []
let matchesTotal = 0
let matchesProcessed = 0

let OUTPUT = {}

function doStuff(report, reportId) {
  matchesTotal++
  let players = report.players
  let entries = report.entries
  let metaData = report.metaData
  let hash = JSON.stringify(players)
  hash = HASH(hash)
  if (dupes.includes(hash)) {
    console.log(reportId + ' Duplicate')
    dupeCount++
    console.log('Dupe count: ' + dupeCount)
    return
  } else {
    dupes.push(hash)
  }

  jailorLeftD1 = false
  for (let name in players) {
    if (players[name].role == 'Jailor') {
      if (players[name].left) {
        switch (players[name].left.split('.')[0]) {
          case 'D0':
          case 'D1':
          case 'N1':
            console.log(reportId + ' Jailor left'.magenta)
            return
        }
      }
    }
    if (players[name].account == metaData.reportedPlayer && metaData.reportReason == 'Gamethrowing') {
      if (players[name].role == 'Jailor') {
        console.log(reportId + ' Jailor was reported for gamethrowing.'.red)
        return
      }
    }
  }

  let jailorOutedD1 = false
  let jailorOutedD2 = false
  let townWon = false
  for (let i = 0; i < entries.length; i++) {
    let entry = entries[i]
    if (entry.type == 'DAY CHAT' && entry.time.split('.')[0] == 'D1') {
      let name = entry.author
      let player = players[name]
      let role = player.role
      if (role == 'Jailor') {
        let text = entry.text
        text = text
          .toUpperCase()
          .replace(/[^A-Z0-9 ]/g, '')
          .trim()
        if (/\bJAILOR\b/.test(text) || /\bTP\b/.test(text) || /\bTP\b/.test(text) || /\bTPLO\b/.test(text) || /\bON ME\b/.test(text)) {
          jailorOutedD1 = true
          //console.log(`${reportId} ${name} outed D1: ${text}`)
        }
      }
    }
    if (entry.type == 'DAY CHAT' && entry.time.split('.')[0] == 'D2') {
      let name = entry.author
      let player = players[name]
      let role = player.role
      if (role == 'Jailor') {
        let text = entry.text
        text = text
          .toUpperCase()
          .replace(/[^A-Z0-9 ]/g, '')
          .trim()
        if (/\bJAILOR\b/.test(text) || /\bTP\b/.test(text) || /\bTP\b/.test(text) || /\bTPLO\b/.test(text) || /\bON ME\b/.test(text)) {
          if (!jailorOutedD1) {
            jailorOutedD2 = true
            console.log(`${reportId} ${name} outed D2: ${text}`)
          }
        }
      }
    }
    if (entry.type == 'SYSTEM' && entry.text == 'Town has won.') {
      townWon = true
    }
  }

  jailorOutedD1 ? jailorOutedD1 = 'jailor outed d1' : jailorOutedD1 = 'jailor didn\'t out D1'
  jailorOutedD2 ? jailorOutedD2 = 'jailor outed d2' : jailorOutedD2 = 'jailor didn\'t out D2'
  townWon ? townWon = 'town won' : townWon = 'town lost'

  if (OUTPUT[jailorOutedD2] === undefined) { OUTPUT[jailorOutedD2] = new Object() }
  if (OUTPUT[jailorOutedD2][townWon] === undefined) { OUTPUT[jailorOutedD2][townWon] = 0 }
  OUTPUT[jailorOutedD2][townWon]++

  matchesProcessed++
  console.log(reportId + ' ' + matchesProcessed + ' ' + matchesTotal + ` ${jailorOutedD2}`.cyan + ` ${townWon}`.yellow)
}

process.on('exit', () => {
  console.log('exit')
  stream1.write(JSON.stringify(OUTPUT, null, 2), (() => { }))
  console.log('Saved to file.')
})

process.on('SIGINT', () => {
  console.log('SIGINT')
  console.log(JSON.stringify(OUTPUT, null, 2))
  process.exit(); // Add code if necessary
});

/*
phrase = phrase
        .toUpperCase()
        .replace(/[^A-Z0-9 ]/g, '')
        .replace(/[0-9]/g, '#')
        .replace(/###/g, '#')
        .replace(/##/g, '#')
        .trim()
      if (phrases[phrase] === undefined) {
        phrases[phrase] = { WON: 0, LOST: 0 }
      }
      phrases[phrase][outcome]++
      */
