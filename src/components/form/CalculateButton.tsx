'use client';

import { Button } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';

type Props = {
    onClick: () => void; // รับฟังก์ชันจากภายนอก
};

export default function CalculateButton({ onClick }: Props) {
    return (
        <Button
            variant="contained"
            size="large"
            startIcon={<CalculateIcon />}
            color="secondary"
            onClick={onClick} // เรียกเมื่อคลิก
        >
            Calculate Now
        </Button>
    );
}