<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
    <html>
        <head>
            <title><xsl:value-of select="rua/meta/nome"/></title>
        </head>
        <body>
            <h1><xsl:value-of select="rua/meta/nome"/></h1>
            <h2>Número: <xsl:value-of select="rua/meta/número"/></h2>

            <!-- Exibir todas as figuras e suas legendas -->
            <xsl:for-each select="rua/corpo/figura">
                <div>
                    <img>
                        <xsl:attribute name="src">
                            <xsl:value-of select="imagem/@path"/>
                        </xsl:attribute>
                        <xsl:attribute name="alt">
                            <xsl:value-of select="legenda"/>
                        </xsl:attribute>
                    </img>
                    <p><xsl:value-of select="legenda"/></p>
                </div>
            </xsl:for-each>

            <!-- Exibir todos os parágrafos de texto -->
            <xsl:for-each select="rua/corpo/para">
                <p><xsl:value-of select="."/></p>
            </xsl:for-each>
        </body>
    </html>
</xsl:template>

</xsl:stylesheet>



