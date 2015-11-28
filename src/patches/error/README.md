error
=====

Поддержка тега `<error>` (для разбора сообщений с информацией об ошибке сервера).

```
<error>
    <uid>login@company</uid>
    <moment>20140319032758104</moment>
    <message>java.lang.IllegalArgumentException: No enum constant
        com.lognex.batch.exchange.msxml.ExchangeDomainEnum.GoodImage
    </message>
    <stack>
        <![CDATA[
javax.ejb.EJBException: java.lang.IllegalArgumentException: No enum constant com.lognex.batch.exchange.msxml.ExchangeDomainEnum.GoodImage
	at org.jboss.as.ejb3.tx.BMTInterceptor.handleException(BMTInterceptor.java:78)
	at org.jboss.as.ejb3.tx.EjbBMTInterceptor.checkStatelessDone(EjbBMTInterceptor.java:92)
	at org.jboss.as.ejb3.tx.EjbBMTInterceptor.handleInvocation(EjbBMTInterceptor.java:107)
	... 67 more
]]>
    </stack>
</error>
```
