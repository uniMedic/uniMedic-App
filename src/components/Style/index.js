const palette = {
  red: "#E63946",
  green: "#F1FAEE",
  blue: "#A8DADC",
  night_blue: "#457B9D",
  slate: "#1D3557",
  background: "#FFFFFF",
};

const IntroStyle = {
  image: {
    width: undefined,
    height: "50%",
    aspectRatio: 1,

    backgroundColor: palette.background,
  },
  title: {
    color: palette.slate,
  },
  subtitle: {
    color: palette.night_blue,
  },
  container: {
    backgroundColor: palette.background,
  },

  buttonStyle: {
    backgroundColor: palette.slate,
  },
  containerViewStyle: {
    marginVertical: 10,
    backgroundColor: palette.background,
  },
  textStyle: { color: palette.night_blue },
};

const ChatStyle = {
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: palette.background,
  },
  button: {
    backgroundColor: palette.slate,
    alignItems: "center",
    padding: 16,
  },
  indicator: {
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalImage: {
    paddingVertical: 10,
    width: "100%",
    height: undefined,
    aspectRatio: 4 / 3,
    borderRadius: 20,
  },
  bubble: {
    right: { backgroundColor: palette.slate },
  },
};

export { palette, IntroStyle, ChatStyle };