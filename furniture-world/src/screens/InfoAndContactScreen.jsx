
import { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Linking, TextInput, Button, Keyboard, KeyboardAvoidingView, Platform } from "react-native";

export default function InfoAndContactScreen() {

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const scrollRef = useRef(null);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
    return () => {
      showSub.remove();
    };
  }, []);


const sendEmail = () => {

  if (subject.trim().length < 5) {
    alert("Subject must be at least 5 characters.");
    return;
  }

  if (message.trim().length < 10) {
    alert("Message must be at least 10 characters.");
    return;
  }

  const email = "alphacentauri6677@gmail.com";

  const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  Linking.openURL(url);

  setSubject("");
  setMessage("");
};

  const openEmail = () => {
    Linking.openURL("mailto:alphacentauri6677@gmail.com");
  };

  const openPhone = () => {
    Linking.openURL("tel:+359888777999");
  };

    const openGithub = () => {
      Linking.openURL("https://github.com/MariusGeorgiev");
    };

  return (
    <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === "ios" ? "padding" : "height"}
>
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
    >

      <Text style={styles.title}>Furniture World</Text>

      
      <Text style={styles.section}>About</Text>

      <Text style={styles.text}>
        Furniture World is a Store App for s student project created in 2026. 
        The project demonstrates building a furniture shop app with React Native, including 
        features like product categories, favorites, shopping cart, profile and order management e.t.c.
        App is created by Marius Georgiev.
      </Text>

      <Text style={styles.text}>
        Our products are made from different materials such as wood, glass,
        and metal. We offer a wide range of furniture designed for comfort,
        functionality, and modern interior styles. In addition to traditional
        furniture, we also provide lighting products, pet furniture, storage
        solutions, and garden furniture.
      </Text>

      <Text style={styles.section}>Contacts</Text>

      <View style={styles.contactBox}>
        <Text style={styles.link} onPress={openEmail}>
          Email: alphacentauri6677@gmail.com
        </Text>
      </View>

      <View style={styles.contactBox}>
        <Text style={styles.link} onPress={openPhone}>
          Phone: +359 888 777 999
        </Text>
      </View>

      <View style={styles.contactBox}>
        <Text style={styles.link} onPress={openGithub}>
          GitHub: github.com/MariusGeorgiev
        </Text>
      </View>

      <Text style={styles.section}>Contact Form</Text>

        <TextInput
          style={styles.input}
          placeholder="Subject"
          placeholderTextColor="#666"
          value={subject}
          onChangeText={setSubject}
        />
        <TextInput
          style={styles.input}
          placeholder="Write your message..."
          placeholderTextColor="#666"
          multiline
          numberOfLines={4}
          value={message}
          onChangeText={setMessage}
          onFocus={() => {
            setTimeout(() => {
                  scrollRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }}
          />

        <Button
          title="Send Email"
          onPress={sendEmail}
        />

      <Text style={styles.section}>Version</Text>
      <Text style={styles.text}>1.0</Text>

      </ScrollView>
</KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff"
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15
  },

  section: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 12
  },

  text: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
    textAlign: "center"
  },

  contactBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#f9f9f9"
  },

  link: {
    fontSize: 16,
    color: "#007AFF"
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: "top"
  }

});