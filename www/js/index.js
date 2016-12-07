<script language="javascript">

    function fixedFooter()
    {
    if (document.all) Offset=document.body.scrollTop;
    else Offset=window.pageYOffset;
    document.getElementById('footer').style.top=Offset+'px';
    }

    setInterval('fixedFooter()',100);

</script>