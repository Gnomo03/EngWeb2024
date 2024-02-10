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
      <td><xsl:value-of select="@id" /></td>
      <td><xsl:value-of select="legenda" /></td>
      <td>
        <img>
          <xsl:attribute name="src">
            <xsl:value-of select="imagem/@path"/>
          </xsl:attribute>
          <xsl:attribute name="alt">
            Image at path: <xsl:value-of select="imagem/@path"/>
          </xsl:attribute>
        </img>
      </td>
    </tr>
    </xsl:for-each>
  </table>
  <xsl:for-each select="rua/corpo/para">
    <p>
      <xsl:value-of select="."/>
    </p>
  </xsl:for-each>
  </body>
  </html>
</xsl:template>
</xsl:stylesheet>
