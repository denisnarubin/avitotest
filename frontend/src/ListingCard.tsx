import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Card, CardContent, CardMedia, Typography, Chip, Stack,
    TextField, Select, MenuItem, InputLabel, FormControl, Slider, Checkbox, ListItemText,
    ToggleButtonGroup, ToggleButton, Pagination, Button
} from '@mui/material';

type Listing = {
    id: number;
    title: string;
    price: number;
    category: string;
    categoryId: number;
    createdAt: string;
    status: 'pending' | 'approved' | 'rejected' | 'draft';
    priority: 'normal' | 'urgent';
    images?: string[];
};

const categories = ['Электроника', 'Одежда', 'Недвижимость'];
const statuses = ['pending', 'approved', 'rejected', 'draft'];

export default function ListingPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [status, setStatus] = useState<string[]>([]);
    const [price, setPrice] = useState<number[]>([0, 100000]);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await axios.get('/api/v1/ads', {
                    params: {
                        page,
                        limit,
                        search,
                        categoryId: categoryId || undefined,
                        status,
                        minPrice: price[0],
                        maxPrice: price[1],
                        sortBy,
                        sortOrder
                    }
                });
                setListings(response.data.ads || []);
                setTotalItems(response.data.pagination?.totalItems || response.data.ads.length);
            } catch (error) {
                console.error('Ошибка загрузки объявлений:', error);
            }
        };

        fetchAds();
    }, [search, categoryId, status, price, sortBy, sortOrder, page]);

    return (
        <Box p={3}>

            <Stack spacing={2} mb={3}>
                <TextField
                    label="Поиск"
                    value={search}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                />

                <FormControl>
                    <InputLabel>Категория</InputLabel>
                    <Select
                        value={categoryId}
                        onChange={(e) => setCategoryId(Number(e.target.value))}
                    >
                        <MenuItem value=""><em>Все</em></MenuItem>
                        {categories.map((cat, index) => (
                            <MenuItem key={cat} value={index + 1}>{cat}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl>
                    <InputLabel>Статус</InputLabel>
                    <Select
                        multiple
                        value={status}
                        onChange={(e) => setStatus(e.target.value as string[])}
                        renderValue={(selected: string[]) => selected.join(', ')}
                    >
                        {statuses.map(s => (
                            <MenuItem key={s} value={s}>
                                <Checkbox checked={status.includes(s)} />
                                <ListItemText primary={s} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box>
                    <Typography gutterBottom>Цена</Typography>
                    <Slider
                        value={price}
                        onChange={(_, val) => setPrice(val as number[])}
                        valueLabelDisplay="auto"
                        min={0}
                        max={100000}
                    />
                </Box>

                <Button
                    variant="outlined"
                    onClick={() => {
                        setSearch('');
                        setCategoryId('');
                        setStatus([]);
                        setPrice([0, 100000]);
                    }}
                >
                    Сбросить фильтры
                </Button>
            </Stack>


            <ToggleButtonGroup
                value={sortBy}
                onChange={(_, val) => val && setSortBy(val)}
                exclusive
                sx={{ mb: 2 }}
            >
                <ToggleButton value="createdAt">Дата</ToggleButton>
                <ToggleButton value="price">Цена</ToggleButton>
                <ToggleButton value="priority">Приоритет</ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
                value={sortOrder}
                onChange={(_, val) => val && setSortOrder(val)}
                exclusive
                sx={{ mb: 3 }}
            >
                <ToggleButton value="asc">↑</ToggleButton>
                <ToggleButton value="desc">↓</ToggleButton>
            </ToggleButtonGroup>


            <Stack spacing={2}>
                {listings.map(item => (
                    <Box key={item.id} sx={{ width: '100%' }}>
                        <Card>
                            <Stack direction="row" spacing={2}>

                                <CardMedia
                                    component="img"
                                    sx={{ width: 200 }}
                                    image={item.images?.[0] || '/placeholder.jpg'}
                                    alt={item.title}
                                />

                                <CardContent sx={{ flex: 1 }}>
                                    <Box
                                        mt={2}
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="flex-start"
                                        flexDirection={{ xs: 'column', md: 'row' }} 
                                    >
                                       
                                        <Box>
                                            <Typography variant="h6">{item.title}</Typography>
                                            <Typography color="text.secondary">{item.price} ₽</Typography>
                                            <Typography variant="body2">
                                                {item.category || `Категория #${item.categoryId}`} • {new Date(item.createdAt).toLocaleDateString()}
                                            </Typography>

                                            <Stack direction="row" spacing={1} mt={1}>
                                                <Chip label={item.status} color={getStatusColor(item.status)} />
                                                <Chip label={item.priority === 'urgent' ? 'Срочный' : 'Обычный'} variant="outlined" />
                                            </Stack>
                                        </Box>

                                       
                                        <Box mt={{ xs: 2, md: 0 }} display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                                            <Button variant="contained">Открыть</Button>
                                        </Box>
                                    </Box>

                                </CardContent>


                            </Stack>
                        </Card>
                    </Box>
                ))}
            </Stack>




            <Pagination
                count={Math.ceil(totalItems / limit)}
                page={page}
                onChange={(_, val) => setPage(val)}
                sx={{ mt: 4 }}
            />
            <Typography variant="body2" mt={2}>Всего: {totalItems} объявлений</Typography>
        </Box>
    );
}

function getStatusColor(status: string): "success" | "warning" | "error" | "default" {
    switch (status) {
        case 'approved': return 'success';
        case 'pending': return 'warning';
        case 'rejected': return 'error';
        default: return 'default';
    }
}
