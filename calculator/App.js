import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "./components/Button";
import { ScrollView } from "react-native";

/**
 * Main component of the calculator app.
 * @returns {JSX.Element} The rendered component.
 */
export default function App() {
  const [display, setDisplay] = React.useState("0");
  const [last, setLast] = React.useState("");
  const [customButtons, setCustomButtons] = React.useState(null);
  const [customStyles, setCustomStyles] = React.useState(null);

  const loadConfig = async (code) => {
    try {
      const response = await fetch(`https://theme.einsluca.top/theme/${code}`);
      const data = await response.json();

      // filter all style props that are null
      for (const key in data.data.styles) {
        for (const styleKey in data.data.styles[key]) {
          if (data.data.styles[key][styleKey] === null) {
            delete data.data.styles[key][styleKey];
          }
        }
      }

      setCustomButtons(data.data.buttons);
      setCustomStyles(data.data.styles);
      setDisplay("Config loaded");
    } catch (error) {
      setDisplay("Error loading config");
    }
  };

  const defaultButtons = [
    { type: "t1", text: "C", pressHandler: () => setDisplay("") },
    { type: "t1", text: "+ / -", pressHandler: () => { display.startsWith("-") ? setDisplay(display.slice(1)) : setDisplay("-" + display); } },
    { type: "t1", text: "%", pressHandler: () => setDisplay(display + "%") },
    { type: "t2", text: "/", pressHandler: () => setDisplay(display + "/") },
    { type: "t3", text: "7", pressHandler: () => setDisplay(display + "7") },
    { type: "t3", text: "8", pressHandler: () => setDisplay(display + "8") },
    { type: "t3", text: "9", pressHandler: () => setDisplay(display + "9") },
    { type: "t2", text: "*", pressHandler: () => setDisplay(display + "*") },
    { type: "t3", text: "4", pressHandler: () => setDisplay(display + "4") },
    { type: "t3", text: "5", pressHandler: () => setDisplay(display + "5") },
    { type: "t3", text: "6", pressHandler: () => setDisplay(display + "6") },
    { type: "t2", text: "-", pressHandler: () => setDisplay(display + "-") },
    { type: "t3", text: "1", pressHandler: () => setDisplay(display + "1") },
    { type: "t3", text: "2", pressHandler: () => setDisplay(display + "2") },
    { type: "t3", text: "3", pressHandler: () => setDisplay(display + "3") },
    { type: "t2", text: "+", pressHandler: () => setDisplay(display + "+") },
    { type: "t3", text: ".", pressHandler: () => setDisplay(display + ".") },
    { type: "t3", text: "0", pressHandler: () => setDisplay(display + "0") },
    { type: "t3", text: "back", pressHandler: () => { try { setDisplay(display.substring(0, display.length - 1)) } catch { } } },
    { type: "t2", text: "=", pressHandler: () => { equalsHandler(); } }
  ];

  const equalsHandler = () => {
    if (display == "..00") {
      setCustomButtons(null);
      setCustomStyles(null);
      setDisplay("Config reset");
      return;
    }
    

    if (display.startsWith("..") && display.endsWith("00")) {
      loadConfig(display.replace("..", "").replace("00", ""));
      return;
    }


    try {
      setLast(display);
      setDisplay(eval(display.replace("%", " * 0.01")));
    } catch {
      setDisplay(display);
    }
  };

  const buttons = customButtons || defaultButtons;
  const currentStyles = customStyles || styles;

  const renderButtons = () => {
    const rows = [];
    for (let i = 0; i < buttons.length; i += 4) {
      rows.push(buttons.slice(i, i + 4));
    }
    return rows.map((row, index) => (
      <View key={index} style={[currentStyles.row]}>
        {row.map((button, idx) => (
          <Button
            key={idx}
            type={button.type}
            text={button.text}
            pressHandler={() => {
              
              if (typeof button.pressHandler === "function") {
                button.pressHandler();
              } else {
                console.log(button.text)
                if (button.text == "back") {
                  button.pressHandler = () => { setDisplay(prev => prev.substring(0, prev.length - 1)) };
                  return
                }

                if (button.text == "+ / -") {
                  button.pressHandler = () => setDisplay(prev => prev.startsWith("-")
                ? prev.slice(1)
                : "-" + prev);
                  return
                }

                var functionsAvailable = {
                  "setDisplay": setDisplay,
                  "setLast": setLast,
                  "equalsHandler": equalsHandler,                  
                }

                var args = button.pressHandler.split("(")[2].split(")")[0].split(",");
                var functionName = button.pressHandler.split("(")[1].split(">")[1].trim();
                console.log(button.pressHandler)
                console.log(args);

                if (functionsAvailable[functionName]) {
                  if (args[0] === "display") args[0] = display;
                  if (args[0] === "last") args[0] = last;
                  console.log(args);

                  var evaledArgs = args.map(arg => {
                    arg = arg.trim();
                    arg = arg.replaceAll("display", "`" + display + "`");
                    arg = arg.replaceAll("last", "`" + last + "`");
                    try {
                      return eval(arg);
                    } catch {
                      return arg;
                    }
                  }
                  );


                  functionsAvailable[functionName](...evaledArgs);
                }
              }
            }}
          />
        ))}
      </View>
    ));
  };

  return (
    <View style={currentStyles.container}>
      <View style={[currentStyles.textHolder]}>
        <Text style={[currentStyles.lastText]}>{last}</Text>
        <ScrollView style={[currentStyles.sideScroll]} horizontal>
          <Text style={[currentStyles.resultText]} numberOfLines={1}>
            {display}
          </Text>
        </ScrollView>
      </View>

      <View style={[currentStyles.gridContainer]}>
        {renderButtons()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18171E",
    alignItems: "center",
    justifyContent: "center",
  },
  gridContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    alignSelf: "center",
  },
  sideScroll: {
    alignSelf: "flex-end",
  },
  resultText: {
    color: "#fff",
    fontSize: 60,
    alignSelf: "flex-end",
    height: 70,
    textAlign: "right",
  },
  lastText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 40,
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  textHolder: {
    width: "85%",
    marginBottom: 30,
  },
});
