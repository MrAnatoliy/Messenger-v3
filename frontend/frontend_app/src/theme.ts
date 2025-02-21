import { defineConfig,createSystem, defaultConfig } from "@chakra-ui/react";


const config = defineConfig({
    theme: {
        tokens: {
            fonts: {
                heading: { value: "Inter" },
                body: { value: "Inter" },
            },
            gradients: {
                bgGradient: {
                    value: "linear-gradient(135deg, #1B2021, #151A1B)"
                }
            }
        },
        semanticTokens: {
            colors: {
                bgSimple: {
                    value: {
                        base: "#1B2021",
                    }
                },
                bg: {
                    value: {
                        base: "linear-gradient(to right, #1B2021, #151A1B)"
                    }
                },
                lightBrand: {
                    value: {
                        base: "#E3DCC2"
                    }
                },
                mediumBrand: {
                    value: {
                        base: "#E3DC95"
                    }
                },
                darkBrand: {
                    value: {
                        base: "#51513D"
                    }
                }
            },
        },
    },
})

export const system = createSystem(defaultConfig, config)
