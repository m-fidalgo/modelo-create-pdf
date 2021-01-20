import React from "react";
import { StyleSheet, Button, Platform, View, Dimensions } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

export default function App() {
  const resumo = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const subject = "Matéria Matéria";

  async function generateAndSavePdf(resumo, subject) {
    const content = `
      <!DOCTYPE html>      
      <head>
        <style> 
          body {
            font-size: 16px;
            margin: 100px;
          }
          h1 { text-align: center; }
        </style>
      </head>
      <body>
        <h1>${subject}</h1>
        <br />
        <p>${resumo}</p>
      </body>
    `;

    const resp = await Print.printToFileAsync({
      html: content,
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
      base64: false,
    });

    const subjectName = subject
      .normalize("NFD")
      .replace(/[^a-zA-Z ]/g, "")
      .replace(" ", "_");
    console.log(subjectName);

    const pdf = `${resp.uri.slice(
      0,
      resp.uri.lastIndexOf("/") + 1
    )}Resumo_${subjectName}${Platform.OS == "ios" ? "" : ".pdf"}`;

    await FileSystem.moveAsync({
      from: resp.uri,
      to: pdf,
    });

    await Sharing.shareAsync(pdf, {
      UTI: "com.adobe.pdf",
      mimeType: "application/pdf",
    });
  }

  return (
    <View style={styles.container}>
      <Button
        title="Press to Generate PDF"
        onPress={() => generateAndSavePdf(resumo, subject)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
