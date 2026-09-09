import { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { color, type as t, space } from "../../theme/tokens";
import { EventCarousel } from "../../components/eventcarousel";
import { CareScoreCard } from "../../components/carescorecard";
import { StatRow } from "../../components/statrow";
import { ProductCard } from "../../components/productcard";
import { ProductCardSkeleton } from "../../components/productcardskeleton";
import { ProductListSearch } from "../../components/productlistsearch";
import { Sheet } from "../../components/sheet";
import { ProductDetailScreen } from "./productdetail";
import { api, type event, type summary } from "../../services/api";

export function HomeScreen() {
  const [events, setEvents] = useState<event[]>([]);
  const [summary, setSummary] = useState<summary>();
  const [openProductId, setOpenProductId] = useState<string | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => api.products.list(),
  });

  useEffect(() => {
    function load() {
      api.events.list().then(setEvents);
      api.stats.summary().then(setSummary);
    }
    load();
    return api.subscribe(load);
  }, []);

  return (
    <>
      <ScrollView style={styles.root} contentContainerStyle={styles.content}>
        {summary ? (
          <View style={styles.stats}>
            <CareScoreCard score={summary.careScore} note={summary.careScoreNote} />
            <StatRow
              stats={[
                { label: "Items", value: String(summary.itemsInLoop) },
                { label: "Events", value: String(summary.careEventsLogged) },
                { label: "In use", value: String(summary.stillInUse) },
                { label: "Months", value: `+${summary.monthsOfLifeAdded}`, valueColor: color.mint },
              ]}
            />
          </View>
        ) : null}

        <EventCarousel events={events} />

        <View style={styles.products}>
          <View style={styles.productsHeader}>
            <Text style={styles.productsTitle}>Products</Text>
            <Pressable style={styles.viewAll} onPress={() => setShowAllProducts(true)} hitSlop={8}>
              <Text style={styles.viewAllLabel}>View all</Text>
              <Ionicons name="chevron-forward" size={14} color={color.mutedForeground} />
            </Pressable>
          </View>
          <View style={styles.grid}>
            {productsLoading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : products.map((p) => (
                  <ProductCard key={p.id} product={p} onPress={() => setOpenProductId(p.id)} />
                ))}
          </View>
        </View>
      </ScrollView>

      <Sheet visible={!!openProductId} onClose={() => setOpenProductId(null)}>
        {openProductId ? <ProductDetailScreen productId={openProductId} onClose={() => setOpenProductId(null)} /> : null}
      </Sheet>

      <Sheet visible={showAllProducts} onClose={() => setShowAllProducts(false)}>
        <ProductListSearch
          title="Products"
          onClose={() => setShowAllProducts(false)}
          onSelect={(p) => {
            setShowAllProducts(false);
            setOpenProductId(p.id);
          }}
        />
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.background },
  content: { paddingVertical: space.md, gap: space.lg },
  stats: { paddingHorizontal: space.lg, gap: space.sm },
  products: { paddingHorizontal: space.lg, gap: space.md },
  productsHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  productsTitle: { ...t.h3, color: color.foreground },
  viewAll: { flexDirection: "row", alignItems: "center", gap: 2 },
  viewAllLabel: { ...t.bodySmall, color: color.mutedForeground },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: space.md },
});
