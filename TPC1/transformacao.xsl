<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
  <html>
  <body>
  <table>
    <tr>
      <td width='20%'>
        <h2><xsl:value-of select="rua/meta/número"/></h2>
      </td>
      <td width='80%'>
        <h2><xsl:value-of select="rua/meta/nome"/></h2>
      </td>
    </tr>
  </table>
<table>
<xsl:for-each select="rua/corpo/figura">
<tr>
    <td style="text-align: center;width: 100vw; height: auto;">
        <img style="width: 100vw; height: auto;">
            <xsl:attribute name="src">
                <xsl:value-of select="imagem/@path"/>
            </xsl:attribute>
            <xsl:attribute name="alt">
                Image at path: <xsl:value-of select="imagem/@path"/>
            </xsl:attribute>
            <!--<xsl:attribute name="style">display:block; margin:auto;</xsl:attribute>-->
        </img>
        <br/>
        <xsl:value-of select="legenda"/>
    </td>
</tr>
</xsl:for-each>

  </table>
  <xsl:for-each select="rua/corpo/para">
    <p>
      <xsl:value-of select="."/>
    </p>
  </xsl:for-each>
  <table border="1">
   <tr>
        <td>Número</td>
        <td>Enfiteuta</td>
        <td>Foro</td>
        <td>Descrição</td>
    </tr>
  <xsl:for-each select="rua/corpo/lista-casas/casa">
    <tr>
        <td><xsl:value-of select="número" /></td>
        <td><xsl:value-of select="enfiteuta" /></td>
        <td><xsl:value-of select="foro" /></td>
        <td><xsl:value-of select="desc" /></td>
    </tr>
  </xsl:for-each>
  </table>
    <p></p>
  </body>
  </html>
</xsl:template>
</xsl:stylesheet>