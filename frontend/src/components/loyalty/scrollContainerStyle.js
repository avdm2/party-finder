export const scrollContainerStyle = {
    display: 'flex',
    overflowX: 'auto',
    gap: 2,
    py: 2,
    px: 2,
    mx: -2,
    width: 'calc(100% + 32px)',
    scrollBehavior: 'smooth',
    '&::-webkit-scrollbar': {
        height: '6px',
    },
    '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#888',
        borderRadius: '3px',
        '&:hover': {
            background: '#555',
        }
    },
    scrollbarWidth: 'thin',
    scrollbarColor: '#888 #f1f1f1',
};