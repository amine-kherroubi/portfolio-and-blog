<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> - RSS Feed</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            line-height: 1.6;
            padding: 2rem;
            max-width: 800px;
            margin: 0 auto;
            background: #ffffff;
            color: #000000;
          }
          
          header {
            padding: 2rem 0;
            border-bottom: 2px solid #000000;
            margin-bottom: 2rem;
          }
          
          h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            letter-spacing: -0.02em;
          }
          
          .description {
            color: rgba(0, 0, 0, 0.7);
            font-size: 1.125rem;
            margin-bottom: 1rem;
          }
          
          .info {
            background: rgba(0, 0, 0, 0.05);
            padding: 1rem;
            border: 2px solid #000000;
            margin-bottom: 2rem;
            font-size: 0.875rem;
          }
          
          .info strong {
            font-weight: 700;
          }
          
          .items {
            list-style: none;
          }
          
          .item {
            padding: 1.5rem 0;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          }
          
          .item:last-child {
            border-bottom: none;
          }
          
          .item h2 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
          }
          
          .item h2 a {
            color: #000000;
            text-decoration: none;
          }
          
          .item h2 a:hover {
            opacity: 0.7;
          }
          
          .item .date {
            font-size: 0.875rem;
            color: rgba(0, 0, 0, 0.6);
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.5rem;
          }
          
          .item .description {
            color: rgba(0, 0, 0, 0.8);
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        <header>
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p class="description">
            <xsl:value-of select="/rss/channel/description"/>
          </p>
        </header>
        
        <div class="info">
          <p>
            <strong>This is an RSS feed.</strong> Subscribe by copying the URL into your RSS reader. 
            Visit <a href="https://aboutfeeds.com">About Feeds</a> to learn more about RSS.
          </p>
        </div>
        
        <ul class="items">
          <xsl:for-each select="/rss/channel/item">
            <li class="item">
              <div class="date">
                <xsl:value-of select="pubDate"/>
              </div>
              <h2>
                <a>
                  <xsl:attribute name="href">
                    <xsl:value-of select="link"/>
                  </xsl:attribute>
                  <xsl:value-of select="title"/>
                </a>
              </h2>
              <p class="description">
                <xsl:value-of select="description"/>
              </p>
            </li>
          </xsl:for-each>
        </ul>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>