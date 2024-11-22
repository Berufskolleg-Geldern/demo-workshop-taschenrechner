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

  const equalsHandler = () => {
    try {
      setLast(display);
      setDisplay(eval(display.replace("%", " * 0.01")));
    } catch {
      setDisplay(display);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.textHolder]}>
        <Text style={[styles.lastText]}>{last}</Text>
        <ScrollView style={[styles.sideScroll]} horizontal>
          <Text style={[styles.resultText]} numberOfLines={1}>
            {display}
          </Text>
        </ScrollView>
      </View>

      <View style={[styles.gridContainer]}>
        <View style={[styles.row]}>
          <Button type="t1" text="C" pressHandler={() => setDisplay("")} />
          <Button
            type="t1"
            text="+ / -"
            pressHandler={() => {
              display.startsWith("-")
                ? setDisplay(display.slice(1))
                : setDisplay("-" + display);
            }}
          />
          <Button
            type="t1"
            text="%"
            pressHandler={() => setDisplay(display + "%")}
          />
          <Button
            type="t2"
            text="/"
            pressHandler={() => setDisplay(display + "/")}
          />
        </View>
        <View style={[styles.row]}>
          <Button
            type="t3"
            text="7"
            pressHandler={() => setDisplay(display + "7")}
          />
          <Button
            type="t3"
            text="8"
            pressHandler={() => setDisplay(display + "8")}
          />
          <Button
            type="t3"
            text="9"
            pressHandler={() => setDisplay(display + "9")}
          />
          <Button
            type="t2"
            text="*"
            pressHandler={() => setDisplay(display + "*")}
          />
        </View>
        <View style={[styles.row]}>
          <Button
            type="t3"
            text="4"
            pressHandler={() => setDisplay(display + "4")}
          />
          <Button
            type="t3"
            text="5"
            pressHandler={() => setDisplay(display + "5")}
          />
          <Button
            type="t3"
            text="6"
            pressHandler={() => setDisplay(display + "6")}
          />
          <Button
            type="t2"
            text="-"
            pressHandler={() => setDisplay(display + "-")}
          />
        </View>
        <View style={[styles.row]}>
          <Button
            type="t3"
            text="1"
            pressHandler={() => setDisplay(display + "1")}
          />
          <Button
            type="t3"
            text="2"
            pressHandler={() => setDisplay(display + "2")}
          />
          <Button
            type="t3"
            text="3"
            pressHandler={() => setDisplay(display + "3")}
          />
          <Button
            type="t2"
            text="+"
            pressHandler={() => setDisplay(display + "+")}
          />
        </View>
        <View style={[styles.row]}>
          <Button
            type="t3"
            text="."
            pressHandler={() => setDisplay(display + ".")}
          />
          <Button
            type="t3"
            text="0"
            pressHandler={() => setDisplay(display + "0")}
          />
          <Button
            type="t3"
            text="back"
            pressHandler={() => {
              try {
                setDisplay(display.substring(0, display.length - 1))
              } catch { }
            }
            }
          />
          <Button
            type="t2"
            text="="
            pressHandler={() => {
              equalsHandler();
            }}
          />
        </View>
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
