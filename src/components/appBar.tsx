import { AppBar, Box, IconButton, Toolbar, Typography, Button } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

const pages = ['Sega'];

export default function Navbar() {
  const router = useRouter()

  const handleClick = (page: string) => {
    if (page.toLowerCase() === "sega") {
      router.push(`/`)
    } else {
      router.push(`/${page.toLowerCase()}`)
    }
    
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar >
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              onClick={() => handleClick("sega")}
              sx={{ 
                my: 2, 
                color: 'white', 
                display: 'block', 
                margin: 0, 
                paddingTop: 0, 
                paddingBottom: 0, 
                paddingLeft: 0, 
                paddingRight: 2 
              }}
            >
              <Image alt="logo chazki" height={20} width={110} src="/logo.png" />
            </Button>

            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleClick(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))} 
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}